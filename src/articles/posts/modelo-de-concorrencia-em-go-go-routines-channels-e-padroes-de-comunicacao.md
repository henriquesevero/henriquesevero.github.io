Go não apenas suporta concorrência, ela foi projetada em torno dela. Enquanto a maioria das linguagens trata concorrência como uma biblioteca ou extensão, Go a torna um cidadão de primeira classe da linguagem. Entender o modelo de concorrência de Go profundamente é a diferença entre escrever código que *funciona* e código que *escala*.

Este artigo vai fundo: do modelo CSP e o scheduler do Go até os padrões mais sofisticados usados em sistemas de alta disponibilidade.

---

## O Fundamento Filosófico: CSP

Go fundamenta seu modelo de concorrência no **Communicating Sequential Processes (CSP)**, formalizado por Tony Hoare em 1978. A premissa central é poderosa na sua simplicidade:

> *"Do not communicate by sharing memory; instead, share memory by communicating."*

Essa inversão de perspectiva é profunda. Na maioria dos modelos baseados em threads, a coordenação acontece via memória compartilhada protegida por mutexes, o que força o programador a raciocinar sobre estado mutável distribuído, uma das fontes mais ricas de bugs em sistemas concorrentes.

Em Go, a preferência é transferir posse de dados entre goroutines via channels. Quando uma goroutine envia um valor para outra, ela transfere a responsabilidade sobre aquele dado, eliminando a necessidade de sincronização explícita na maioria dos casos.

---

## Goroutines: Muito Além de Threads

### O que são, de verdade

Uma goroutine **não é uma thread do sistema operacional**. Essa distinção é fundamental. Goroutines são gerenciadas pelo runtime do Go através de um modelo **M:N threading**: múltiplas goroutines (`N`) são multiplexadas sobre um número menor de threads do SO (`M`).

```go
go func() {
    fmt.Println("executando em uma goroutine")
}()
```

Esse `go` é tudo que você precisa. Por baixo dos panos, o runtime faz um trabalho considerável.

### O Scheduler Go: G, M e P

O scheduler do Go usa três abstrações centrais:

- **G (Goroutine)**: a goroutine em si, contém stack, estado de execução e a função a executar.
- **M (Machine)**: uma thread do SO. Executa código Go.
- **P (Processor)**: um contexto de execução lógico que conecta M e G. Controla a run queue local.

```
G1  G2  G3  G4        ← goroutines aguardando
 \   |   |  /
  [P1 run queue]  [P2 run queue]
       |                |
      M1               M2           ← threads do SO
       |                |
    [OS thread]     [OS thread]
```

O número de Ps é controlado por `GOMAXPROCS`, que por padrão é igual ao número de CPUs lógicas disponíveis. Isso significa que Go é genuinamente paralelo em máquinas multicore, sem configuração adicional.

```go
import "runtime"

func main() {
    fmt.Println("CPUs disponíveis:", runtime.NumCPU())
    fmt.Println("GOMAXPROCS atual:", runtime.GOMAXPROCS(0))
}
```

### Custo e Stack Dinâmica

O custo de criar uma goroutine é drasticamente menor que uma thread. Uma thread típica do SO aloca 1–8MB de stack fixo. Uma goroutine começa com apenas **2KB** e cresce dinamicamente conforme necessário (até 1GB por padrão no Go moderno).

Isso permite criar dezenas de milhares de goroutines sem se preocupar com esgotamento de memória, padrão impossível com threads tradicionais.

```go
// Criar 100.000 goroutines é completamente razoável em Go
func main() {
    var wg sync.WaitGroup
    for i := 0; i < 100_000; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            time.Sleep(time.Second)
        }(i)
    }
    wg.Wait()
}
```

### Preempção

Até Go 1.13, goroutines eram cooperativamente preemptadas, elas só cediam o processador em pontos de saída explícitos (chamadas de função, operações de I/O, etc.). Go 1.14 introduziu **preempção assíncrona baseada em sinalização**: o runtime pode interromper uma goroutine em qualquer ponto seguro, eliminando o risco de goroutines monopolizarem um P.

---

## Channels: O Sistema Nervoso da Concorrência

### Tipos e Semântica

Channels são typed conduits para comunicação entre goroutines. Existem duas variantes fundamentais:

#### Unbuffered (síncrono)

```go
ch := make(chan int) // capacidade zero
```

Um envio bloqueia até que haja um receptor. Um recebimento bloqueia até que haja um emissor. É uma **sincronização de rendez-vous**, ambos os lados precisam estar prontos simultaneamente.

```go
func soma(a, b int, resultado chan<- int) {
    resultado <- a + b // bloqueia até alguém receber
}

func main() {
    ch := make(chan int)
    go soma(3, 4, ch)
    r := <-ch // bloqueia até soma enviar
    fmt.Println(r) // 7
}
```

#### Buffered (assíncrono até o limite)

```go
ch := make(chan int, 5) // capacidade 5
```

Envia não bloqueiam enquanto o buffer não estiver cheio. Recebimentos não bloqueiam enquanto o buffer não estiver vazio. A semântica se torna assíncrona dentro da capacidade do buffer.

```go
ch := make(chan int, 3)
ch <- 1 // não bloqueia
ch <- 2 // não bloqueia
ch <- 3 // não bloqueia
ch <- 4 // BLOQUEIA, buffer cheio
```

A escolha entre buffered e unbuffered tem implicações profundas de design. Channels unbuffered garantem **acoplamento temporal**, você sabe que o emissor só prossegue quando o receptor processou o valor. Channels buffered introduzem **desacoplamento temporal**, mas também a possibilidade de acúmulo de pressão no sistema (backpressure).

### Direcionamento de Channels

Go permite restringir channels a apenas envio ou apenas recebimento em assinaturas de função, criando **contratos explícitos** de comunicação:

```go
func producer(out chan<- int) { // apenas envia
    for i := 0; i < 10; i++ {
        out <- i
    }
    close(out)
}

func consumer(in <-chan int) { // apenas recebe
    for v := range in {
        fmt.Println(v)
    }
}

func main() {
    ch := make(chan int, 5)
    go producer(ch)
    consumer(ch)
}
```

O compilador garante que `producer` não lê de `out` e `consumer` não escreve em `in`. Violações são erros de compilação, não bugs em produção.

### Fechamento de Channels e Iteração

`close(ch)` sinaliza que nenhum valor adicional será enviado. Receptores podem detectar isso:

```go
// forma explícita
v, ok := <-ch
if !ok {
    // channel fechado e vazio
}

// forma idiomática com range
for v := range ch {
    // itera até ch ser fechado e drenado
    process(v)
}
```

**Regra crítica**: apenas o emissor deve fechar um channel. Fechar um channel já fechado causa panic. Enviar para um channel fechado causa panic.

---

## Select: Multiplexação de Channels

`select` é a construção que eleva channels de um mecanismo de comunicação para uma ferramenta de composição:

```go
select {
case v := <-ch1:
    // recebeu de ch1
case v := <-ch2:
    // recebeu de ch2
case ch3 <- x:
    // enviou para ch3
default:
    // nenhuma operação pronta (não bloqueia)
}
```

Quando múltiplos cases estão prontos simultaneamente, Go escolhe **aleatoriamente** entre eles, evitando starvation por design.

### Timeout com Select

```go
func fetchWithTimeout(url string, timeout time.Duration) (string, error) {
    resultCh := make(chan string, 1)
    errCh    := make(chan error, 1)

    go func() {
        resp, err := http.Get(url)
        if err != nil {
            errCh <- err
            return
        }
        defer resp.Body.Close()
        body, _ := io.ReadAll(resp.Body)
        resultCh <- string(body)
    }()

    select {
    case result := <-resultCh:
        return result, nil
    case err := <-errCh:
        return "", err
    case <-time.After(timeout):
        return "", fmt.Errorf("timeout após %v", timeout)
    }
}
```

`time.After` retorna um channel que recebe um valor após a duração especificada, padrão idiomático para timeouts.

---

## Padrões de Concorrência

### 1. Pipeline

Pipelines conectam estágios de processamento onde cada estágio recebe de um channel upstream e envia para um channel downstream. Cada estágio roda em sua própria goroutine, permitindo processamento paralelo ao longo do pipeline.

```go
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

func filter(in <-chan int, pred func(int) bool) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            if pred(n) {
                out <- n
            }
        }
    }()
    return out
}

func main() {
    nums    := generate(2, 3, 4, 5, 6, 7, 8, 9)
    squares := square(nums)
    evens   := filter(squares, func(n int) bool { return n%2 == 0 })

    for v := range evens {
        fmt.Println(v) // 4, 16, 36, 64
    }
}
```

O pipeline compõe de forma funcional: cada etapa é uma função pura que aceita e retorna channels. Adicionar ou remover estágios não exige modificar o código adjacente.

### 2. Fan-Out / Fan-In

Fan-out distribui trabalho de um channel para múltiplos workers. Fan-in agrega resultados de múltiplos channels em um único.

```go
// Fan-out: distribui trabalho para N workers
func fanOut(in <-chan Job, workers int) []<-chan Result {
    channels := make([]<-chan Result, workers)
    for i := 0; i < workers; i++ {
        channels[i] = worker(in)
    }
    return channels
}

func worker(in <-chan Job) <-chan Result {
    out := make(chan Result)
    go func() {
        defer close(out)
        for job := range in {
            out <- process(job)
        }
    }()
    return out
}

// Fan-in: agrega N channels em um
func fanIn(channels ...<-chan Result) <-chan Result {
    var wg sync.WaitGroup
    merged := make(chan Result, len(channels))

    output := func(ch <-chan Result) {
        defer wg.Done()
        for r := range ch {
            merged <- r
        }
    }

    wg.Add(len(channels))
    for _, ch := range channels {
        go output(ch)
    }

    go func() {
        wg.Wait()
        close(merged)
    }()

    return merged
}
```

O padrão fan-out/fan-in é a espinha dorsal de sistemas de processamento paralelo em Go. É usado extensivamente em ingestão de eventos, processamento de filas e scraping distribuído.

### 3. Worker Pool

Um worker pool limita o número de goroutines ativas processando trabalho, fundamental para controlar uso de recursos:

```go
type WorkerPool struct {
    jobs    chan Job
    results chan Result
    workers int
}

func NewWorkerPool(workers, queueSize int) *WorkerPool {
    return &WorkerPool{
        jobs:    make(chan Job, queueSize),
        results: make(chan Result, queueSize),
        workers: workers,
    }
}

func (p *WorkerPool) Start(ctx context.Context) {
    for i := 0; i < p.workers; i++ {
        go func(id int) {
            for {
                select {
                case job, ok := <-p.jobs:
                    if !ok {
                        return
                    }
                    p.results <- execute(job)
                case <-ctx.Done():
                    return
                }
            }
        }(i)
    }
}

func (p *WorkerPool) Submit(job Job) { p.jobs <- job }
func (p *WorkerPool) Results() <-chan Result { return p.results }
func (p *WorkerPool) Shutdown() { close(p.jobs) }
```

### 4. Done Channel

Antes do pacote `context` se tornar padrão, o padrão "done channel" era a forma idiomática de sinalizar cancelamento:

```go
func generator(done <-chan struct{}) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for i := 0; ; i++ {
            select {
            case out <- i:
            case <-done:
                return
            }
        }
    }()
    return out
}

func main() {
    done := make(chan struct{})
    nums := generator(done)

    for i := 0; i < 5; i++ {
        fmt.Println(<-nums)
    }
    close(done) // broadcast: todas as goroutines que observam done encerram
}
```

### 5. Semáforo com Channel Buffered

Channels buffered implementam semáforos elegantemente, limitando o número de operações concorrentes:

```go
type Semaphore chan struct{}

func NewSemaphore(n int) Semaphore { return make(Semaphore, n) }
func (s Semaphore) Acquire()       { s <- struct{}{} }
func (s Semaphore) Release()       { <-s }

// Limitar a 10 requisições HTTP simultâneas
func fetchAll(urls []string) []string {
    sem     := NewSemaphore(10)
    results := make([]string, len(urls))
    var wg sync.WaitGroup

    for i, url := range urls {
        wg.Add(1)
        go func(idx int, u string) {
            defer wg.Done()
            sem.Acquire()
            defer sem.Release()
            results[idx] = fetch(u)
        }(i, url)
    }

    wg.Wait()
    return results
}
```

### 6. Or-Channel

Combina múltiplos done channels em um, retorna assim que qualquer um deles fechar:

```go
func or(channels ...<-chan struct{}) <-chan struct{} {
    switch len(channels) {
    case 0:
        return nil
    case 1:
        return channels[0]
    }

    orDone := make(chan struct{})
    go func() {
        defer close(orDone)
        switch len(channels) {
        case 2:
            select {
            case <-channels[0]:
            case <-channels[1]:
            }
        default:
            select {
            case <-channels[0]:
            case <-channels[1]:
            case <-channels[2]:
            case <-or(append(channels[3:], orDone)...):
            }
        }
    }()
    return orDone
}
```

---

## O Pacote sync: Quando Channels Não São a Resposta

Channels são ótimos para comunicar dados e coordenar fluxo. Mas para proteger estado compartilhado, o pacote `sync` é a ferramenta certa.

### sync.WaitGroup

```go
func processItems(items []Item) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func(it Item) {
            defer wg.Done()
            process(it)
        }(item)
    }
    wg.Wait()
}
```

**Armadilha comum**: `wg.Add(1)` deve ser chamado **antes** de iniciar a goroutine, nunca dentro dela.

### sync.RWMutex

```go
type SafeCache struct {
    mu sync.RWMutex
    m  map[string]int
}

func (c *SafeCache) Set(key string, val int) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.m[key] = val
}

func (c *SafeCache) Get(key string) int {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.m[key]
}
```

`RWMutex` permite múltiplas leituras concorrentes mas escritas exclusivas. Ideal para caches read-heavy.

### sync.Once

Garante execução única, mesmo com múltiplas goroutines concorrendo:

```go
type DatabasePool struct {
    once sync.Once
    pool *sql.DB
}

func (d *DatabasePool) Get() *sql.DB {
    d.once.Do(func() {
        db, err := sql.Open("postgres", dsn)
        if err != nil {
            panic(err)
        }
        d.pool = db
    })
    return d.pool
}
```

---

## Context: Cancelamento, Deadline e Propagação

O pacote `context` é o mecanismo padrão para propagar cancelamento e deadlines ao longo de uma cadeia de chamadas.

```go
func handleRequest(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    result, err := queryDatabase(ctx)
    if err != nil {
        if errors.Is(err, context.DeadlineExceeded) {
            http.Error(w, "timeout", http.StatusGatewayTimeout)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(result)
}

func queryDatabase(ctx context.Context) (*Result, error) {
    rows, err := db.QueryContext(ctx, "SELECT ...")
    if err != nil {
        return nil, fmt.Errorf("query: %w", err)
    }
    defer rows.Close()
    // ...
    return result, nil
}
```

Contextos formam uma árvore: cancelar um pai cancela todos os filhos. O `defer cancel()` é obrigatório, omiti-lo vaza goroutines e recursos.

---

## O Modelo de Memória do Go

O Go Memory Model define quando uma goroutine pode observar escritas de outra. Violá-lo produz comportamento indefinido.

### Garantias de Sincronização

```go
// Channel: envio happens-before recebimento
var x int
ch := make(chan struct{}, 1)

go func() {
    x = 42
    ch <- struct{}{} // happens-before o recebimento abaixo
}()

<-ch
fmt.Println(x) // garantido: 42
```

### Race Detector

```bash
go test -race ./...
go run -race main.go
```

O race detector detecta data races em tempo de execução. Use sempre em desenvolvimento e CI, o custo de ignorá-lo em produção é muito maior.

```go
// Data race clássica, undefined behavior
var counter int
for i := 0; i < 1000; i++ {
    go func() { counter++ }() // read-modify-write não atômico
}
```

---

## Armadilhas Comuns

### Goroutine Leak

```go
// LEAK, se o chamador ignorar o canal, a goroutine fica bloqueada para sempre
func search(query string) <-chan Result {
    result := make(chan Result) // unbuffered
    go func() {
        result <- expensiveSearch(query) // bloqueia se ninguém lê
    }()
    return result
}

// CORRETO, buffer garante que a goroutine sempre pode encerrar
func search(query string) <-chan Result {
    result := make(chan Result, 1)
    go func() {
        result <- expensiveSearch(query)
    }()
    return result
}
```

Use `goleak` para detectar leaks nos testes:

```go
func TestSearch(t *testing.T) {
    defer goleak.VerifyNone(t)
    // ...
}
```

### Captura de Variável de Loop

```go
// ERRADO, todas as goroutines lêem o mesmo 'i' ao término do loop
for i := 0; i < 5; i++ {
    go func() { fmt.Println(i) }() // imprime 5,5,5,5,5
}

// CORRETO
for i := 0; i < 5; i++ {
    go func(n int) { fmt.Println(n) }(i)
}
```

---

## Composição: Um Sistema Real

Integrando os padrões em um pipeline de eventos com cancelamento, timeout e worker pool:

```go
func ProcessEvents(ctx context.Context, source <-chan Event, workers int) <-chan ProcessedEvent {
    workerOutputs := make([]<-chan ProcessedEvent, workers)
    for i := 0; i < workers; i++ {
        workerOutputs[i] = runWorker(ctx, source)
    }
    return merge(ctx, workerOutputs...)
}

func runWorker(ctx context.Context, in <-chan Event) <-chan ProcessedEvent {
    out := make(chan ProcessedEvent, 10)
    go func() {
        defer close(out)
        for {
            select {
            case event, ok := <-in:
                if !ok {
                    return
                }
                pCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
                result, err := processEvent(pCtx, event)
                cancel()
                if err != nil {
                    log.Printf("erro: %s: %v", event.ID, err)
                    continue
                }
                select {
                case out <- result:
                case <-ctx.Done():
                    return
                }
            case <-ctx.Done():
                return
            }
        }
    }()
    return out
}

func merge(ctx context.Context, channels ...<-chan ProcessedEvent) <-chan ProcessedEvent {
    out := make(chan ProcessedEvent, len(channels)*10)
    var wg sync.WaitGroup

    wg.Add(len(channels))
    for _, ch := range channels {
        go func(c <-chan ProcessedEvent) {
            defer wg.Done()
            for v := range c {
                select {
                case out <- v:
                case <-ctx.Done():
                    return
                }
            }
        }(ch)
    }

    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}
```

---

## Conclusão

O modelo de concorrência do Go não é apenas uma feature, é uma forma diferente de pensar sobre sistemas concorrentes. Ao internalizar CSP, entender o scheduler M:N e dominar os padrões de comunicação, você ganha acesso a um arsenal de ferramentas para construir sistemas que escalam horizontalmente, falham de forma controlada e são significativamente mais fáceis de raciocinar do que equivalentes baseados em threads e locks.

Os padrões discutidos, pipeline, fan-out/fan-in, worker pool, done channel, semáforo, não são receitas a copiar. São primitivos composíveis que você combina de acordo com os requisitos do seu sistema.

O próximo passo: use `-race` em todos os seus testes, adicione `goleak` para detectar goroutine leaks, e leia o [Go Memory Model](https://go.dev/ref/mem), é curto, denso, e vale cada parágrafo.