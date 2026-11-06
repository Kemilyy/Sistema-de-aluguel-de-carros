# Modelos atualizados do RentFlow

Estes diagramas descrevem as classes, rotas e camadas implementadas no código atual. As imagens PNG na pasta `docs/` são as versões iniciais do laboratório e foram mantidas como histórico.

## Casos de uso

```mermaid
flowchart LR
  Cliente([Cliente])
  Agente([Agente])
  Banco([Agente bancário])
  Visitante([Visitante])

  subgraph RF[RentFlow]
    Cadastro([Cadastrar conta])
    Login([Entrar e encerrar sessão])
    Perfil([Consultar e atualizar perfil e rendimentos])
    Conta([Excluir própria conta])
    Catalogo([Consultar veículos e disponibilidade])
    Pedido([Criar e consultar pedidos])
    Editar([Editar observação ou cancelar pedido pendente])
    Avaliar([Consultar dados financeiros e avaliar pedido])
    Credito([Conceder crédito])
    Contrato([Executar e consultar contrato])
    Frota([Cadastrar automóvel])
  end

  Visitante --> Cadastro
  Visitante --> Login
  Cliente --> Login
  Cliente --> Perfil
  Cliente --> Conta
  Cliente --> Catalogo
  Cliente --> Pedido
  Cliente --> Editar
  Agente --> Login
  Agente --> Avaliar
  Agente --> Frota
  Banco --> Login
  Banco --> Avaliar
  Banco --> Credito
  Banco --> Contrato
  Banco --> Frota
  Credito --> Contrato
```

## Pacotes e arquitetura

```mermaid
flowchart LR
  subgraph Frontend[Frontend - React e Vite]
    UI[App.jsx - páginas, estado e modais]
    CSS[styles.css]
    API[services/api.js - fetch e sessão]
    UI --> CSS
    UI --> API
  end

  subgraph Backend[Backend - Spring Boot MVC]
    Controllers[controller\nAuthController · ClienteController\nPedidoController · ContratoController\nAutomovelController]
    Services[service\nUsuarioService · PedidoService\nContratoService · AutomovelService]
    Repositories[repository\nSpring Data JPA]
    Models[model\nUsuario · Rendimento · Automovel\nPedidoAluguel · Contrato · ContratoCredito]
    Controllers --> Services
    Services --> Repositories
    Repositories --> Models
  end

  API -->|HTTP + cookie de sessão| Controllers
  Models -->|Hibernate / JDBC| PostgreSQL[(Supabase PostgreSQL)]
```

## Classes e relações

```mermaid
classDiagram
  class Usuario {
    +Long id
    +String nome
    +String email
    +String senha
    +String tipo
    +String cpf
    +String rg
    +String endereco
    +String profissao
  }
  class Rendimento {
    +Long id
    +String empregador
    +BigDecimal valor
  }
  class Automovel {
    +Long id
    +String matricula
    +Integer ano
    +String marca
    +String modelo
    +String placa
    +String tipoProprietario
    +String categoria
    +BigDecimal precoDiaria
  }
  class PedidoAluguel {
    +Long id
    +String veiculo
    +LocalDate dataInicio
    +LocalDate dataFim
    +BigDecimal valorTotal
    +String status
    +String parecerFinanceiro
    +String observacao
  }
  class Contrato {
    +Long id
    +LocalDate dataContrato
    +String status
  }
  class ContratoCredito {
    +Long id
    +BigDecimal valorCredito
    +LocalDate dataConcessao
  }

  Usuario "1" --> "0..3" Rendimento : declara
  Usuario "1" --> "0..*" PedidoAluguel : solicita
  Automovel "1" --> "0..*" PedidoAluguel : reservado em
  PedidoAluguel "1" --> "0..1" Contrato : formaliza
  PedidoAluguel "1" --> "0..1" ContratoCredito : financiado por
  Usuario "1" --> "0..*" ContratoCredito : banco agente
```

`PedidoAluguel.veiculo` mantém também o nome do automóvel para preservar a descrição do pedido. Pedidos novos guardam ainda a referência `automovel_id`; a coluna é anulável somente para compatibilidade com pedidos antigos criados antes dessa relação.
