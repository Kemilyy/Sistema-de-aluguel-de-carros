import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock3,
  Download,
  FileCheck2,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  WalletCards,
  X,
} from 'lucide-react'
import { apiConfigured, request } from './services/api'

const initialCars = [
  {
    id: 'c1',
    name: 'Jeep Compass',
    type: 'SUV · Automático',
    price: 289,
    image:
      'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=900&q=85',
    tag: 'Mais escolhido',
    color: '#f4eee6',
  },
  {
    id: 'c2',
    name: 'Hyundai Creta',
    type: 'SUV · Automático',
    price: 239,
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85',
    tag: 'Econômico',
    color: '#e8eef3',
  },
  {
    id: 'c3',
    name: 'Honda Civic',
    type: 'Sedan · Automático',
    price: 319,
    image:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85',
    tag: 'Premium',
    color: '#e8eaf0',
  },
]
const seed = [
  {
    id: 'AL-2025',
    car: 'Jeep Compass',
    type: 'SUV · Automático',
    image: initialCars[0].image,
    status: 'Em análise',
    start: '18 nov, 2026',
    end: '22 nov, 2026',
    total: 1156,
    created: '02 nov, 2026',
    owner: 'Ana Silva',
  },
  {
    id: 'AL-2024',
    car: 'Hyundai Creta',
    type: 'SUV · Automático',
    image: initialCars[1].image,
    status: 'Aprovado',
    start: '10 nov, 2026',
    end: '13 nov, 2026',
    total: 717,
    created: '25 out, 2026',
    owner: 'Ana Silva',
  },
  {
    id: 'AL-2021',
    car: 'Honda Civic',
    type: 'Sedan · Automático',
    image: initialCars[2].image,
    status: 'Concluído',
    start: '02 ago, 2026',
    end: '05 ago, 2026',
    total: 957,
    created: '26 jul, 2026',
    owner: 'Ana Silva',
  },
]
const statuses = {
  'Em análise': 'pending',
  Aprovado: 'approved',
  Ativo: 'approved',
  'Aguardando banco': 'pending',
  Reprovado: 'rejected',
  Cancelado: 'cancelled',
  Concluído: 'done',
  Pendente: 'pending',
}
const money = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(n)
function load(key, fallback) {
  try {
    const legacy = key.replace(/^rentflow_/, 'driveon_')
    const value = localStorage.getItem(key) ?? localStorage.getItem(legacy)
    if (value !== null && !localStorage.getItem(key)) localStorage.setItem(key, value)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}
const roleFromApi = (type) =>
  type === 'BANCO' ? 'BANCO' : type === 'AGENTE' ? 'AGENTE' : 'CLIENTE'
function apiOrder(order, cars = initialCars) {
  const car = cars.find((vehicle) => vehicle.name === order.veiculo)
  const statusMap = {
    PENDENTE: 'Em análise',
    EM_ANALISE: 'Em análise',
    APROVADO: 'Aprovado',
    REPROVADO: 'Reprovado',
    CANCELADO: 'Cancelado',
    CONCLUIDO: 'Concluído',
  }
  return {
    id: `AL-${order.id}`,
    car: order.veiculo,
    type: car?.type || 'Veículo alugado',
    image: car?.image || initialCars[0].image,
    status: statusMap[order.status] || order.status,
    start: new Date(`${order.dataInicio}T12:00:00`).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    end: new Date(`${order.dataFim}T12:00:00`).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    total: Number(order.valorTotal),
    created: 'Pedido cadastrado',
    owner: order.cliente?.nome || 'Cliente',
    apiId: order.id,
    details: { note: order.observacao },
  }
}
function apiContract(contract, cars = initialCars) {
  const car = cars.find((vehicle) => vehicle.name === contract.veiculo)
  const dateLabel = (value) =>
    value
      ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—'
  return {
    id: `CT-${contract.id}`,
    apiId: contract.id,
    orderId: `AL-${contract.pedidoId}`,
    client: contract.clienteNome,
    email: contract.clienteEmail,
    car: contract.veiculo,
    type: car?.type || 'Veículo alugado',
    image: car?.image || initialCars[0].image,
    start: dateLabel(contract.dataInicio),
    end: dateLabel(contract.dataFim),
    total: Number(contract.valorTotal),
    created: dateLabel(contract.dataContrato),
    status:
      contract.status === 'ATIVO'
        ? 'Ativo'
        : contract.status === 'AGUARDANDO_BANCO'
          ? 'Aguardando banco'
          : contract.status,
  }
}
async function localPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt.match(/.{1,2}/g).map((x) => parseInt(x, 16))),
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256,
  )
  return [...new Uint8Array(bits)].map((v) => v.toString(16).padStart(2, '0')).join('')
}

export default function App() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(() => load('rentflow_users', []))
  const [orders, setOrders] = useState(() => (apiConfigured ? [] : load('rentflow_orders', seed)))
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [ordersRefresh, setOrdersRefresh] = useState(0)
  const ordersRequestVersion = useRef(0)
  const [contracts, setContracts] = useState([])
  const [contractsLoading, setContractsLoading] = useState(apiConfigured)
  const [contractsError, setContractsError] = useState('')
  const [contractsRefresh, setContractsRefresh] = useState(0)
  const [cars, setCars] = useState(apiConfigured ? [] : initialCars)
  const [carsLoading, setCarsLoading] = useState(apiConfigured)
  const [view, setView] = useState('Início')
  const [modal, setModal] = useState('')
  const [selected, setSelected] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [car, setCar] = useState(initialCars[0])
  const [mobile, setMobile] = useState(false)
  const [authVisible, setAuthVisible] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState('login')
  const [hasUnreadNotification, setHasUnreadNotification] = useState(() =>
    load('rentflow_unread_notification', false),
  )
  useEffect(() => localStorage.removeItem('rentflow_user'), [])
  useEffect(() => localStorage.setItem('rentflow_orders', JSON.stringify(orders)), [orders])
  useEffect(() => localStorage.setItem('rentflow_users', JSON.stringify(users)), [users])
  useEffect(
    () =>
      localStorage.setItem('rentflow_unread_notification', JSON.stringify(hasUnreadNotification)),
    [hasUnreadNotification],
  )
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3200)
      return () => clearTimeout(t)
    }
  }, [toast])
  useEffect(() => {
    if (apiConfigured) {
      request('/automoveis')
        .then((rows) => setCars(rows))
        .catch(() => setToast('Não foi possível carregar os veículos do banco.'))
        .finally(() => setCarsLoading(false))
    }
  }, [])
  useEffect(() => {
    if (!user?.api) {
      setOrdersLoading(false)
      setOrdersError('')
      return
    }
    const requestVersion = ++ordersRequestVersion.current
    let active = true
    setOrders([])
    setOrdersLoading(true)
    setOrdersError('')
    request('/pedidos')
      .then((rows) => {
        if (active && requestVersion === ordersRequestVersion.current) {
          setOrders(rows.map((row) => apiOrder(row, cars)))
        }
      })
      .catch((error) => {
        if (active && requestVersion === ordersRequestVersion.current) {
          setOrdersError(error.message || 'Não foi possível carregar os pedidos.')
        }
      })
      .finally(() => {
        if (active && requestVersion === ordersRequestVersion.current) {
          setOrdersLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [user, cars, ordersRefresh])
  useEffect(() => {
    if (!user?.api) {
      setContractsLoading(false)
      setContractsError('')
      setContracts([])
      return
    }
    let active = true
    setContractsLoading(true)
    setContractsError('')
    request('/contratos')
      .then((rows) => {
        if (active) setContracts(rows.map((row) => apiContract(row, cars)))
      })
      .catch((error) => {
        if (active) {
          setContracts([])
          setContractsError(error.message || 'Não foi possível carregar os contratos.')
        }
      })
      .finally(() => {
        if (active) setContractsLoading(false)
      })
    return () => {
      active = false
    }
  }, [user, cars, orders, contractsRefresh])
  const mine = useMemo(
    () =>
      orders.filter(
        (o) =>
          (user?.api && user?.role === 'CLIENTE') ||
          user?.role === 'AGENTE' ||
          user?.role === 'BANCO' ||
          o.owner === user?.name,
      ),
    [orders, user],
  )
  const filtered = mine.filter(
    (o) =>
      (filter === 'Todos' || o.status === filter) &&
      `${o.id} ${o.car} ${o.status} ${o.owner}`.toLowerCase().includes(query.toLowerCase()),
  )
  const navigate = (name) => {
    setView(name)
    setMobile(false)
    if (name === 'Contratos') {
      setContractsRefresh((value) => value + 1)
    }
    if (name === 'Pedidos' || name === 'Avaliações') {
      setOrdersRefresh((value) => value + 1)
    }
  }
  const signIn = async (email, password) => {
    if (apiConfigured) {
      try {
        const result = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha: password }),
        })
        const account = {
          name: result.nome,
          email: result.email,
          role: roleFromApi(result.tipo),
          api: true,
        }
        setModal('')
        setUser(account)
        localStorage.setItem('rentflow_user', JSON.stringify(account))
        setToast(`Bem-vinda de volta, ${account.name.split(' ')[0]}!`)
      } catch (error) {
        return {
          error:
            error.status === 400
              ? 'E-mail ou senha inválidos. Confira os dados.'
              : 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
        }
      }
      return { success: true }
    }
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    const valid =
      found?.passwordHash && found.passwordHash === (await localPassword(password, found.salt))
    if (valid) {
      setUser(found)
      setModal('')
      localStorage.setItem('rentflow_user', JSON.stringify(found))
      setToast(`Bem-vinda de volta, ${found.name.split(' ')[0]}!`)
      return { success: true }
    }
    return { error: 'E-mail ou senha inválidos. Confira os dados ou crie uma conta.' }
  }
  const signUp = async (data) => {
    if (apiConfigured) {
      try {
        const result = await request('/auth/cadastro', {
          method: 'POST',
          body: JSON.stringify({
            nome: data.name,
            email: data.email,
            senha: data.password,
            tipo: data.role,
            cpf: data.cpf,
            rg: data.rg,
            endereco: data.address,
            profissao: data.profession,
            rendimentos: data.rendimentos,
          }),
        })
        const account = {
          name: result.nome,
          email: result.email,
          role: roleFromApi(result.tipo),
          api: true,
        }
        setModal('')
        setUser(account)
        localStorage.setItem('rentflow_user', JSON.stringify(account))
        setToast('Conta criada e salva no banco de dados.')
      } catch (error) {
        return {
          error:
            error.status === 400
              ? error.message ||
                'Confira os dados do cadastro; talvez este e-mail já esteja registrado.'
              : 'Não foi possível conectar ao servidor. O cadastro não foi salvo.',
        }
      }
      return { success: true }
    }
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase()))
      return { error: 'Este e-mail já possui cadastro.' }
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const saltHex = [...salt].map((v) => v.toString(16).padStart(2, '0')).join('')
    const account = {
      name: data.name,
      email: data.email,
      role: data.role,
      cpf: data.cpf,
      rg: data.rg,
      address: data.address,
      profession: data.profession,
      rendimentos: data.rendimentos,
      salt: saltHex,
      passwordHash: await localPassword(data.password, saltHex),
    }
    const next = [...users, account]
    setUsers(next)
    setModal('')
    setUser(account)
    localStorage.setItem('rentflow_user', JSON.stringify(account))
    setToast('Conta criada com sucesso!')
    return { success: true }
  }
  const demo = (role) => {
    const u = {
      name:
        role === 'CLIENTE' ? 'Ana Silva' : role === 'BANCO' ? 'Marcos Oliveira' : 'Carla Mendes',
      email: `${role.toLowerCase()}@rentflow.demo`,
      role,
    }
    setUser(u)
    setModal('')
    localStorage.setItem('rentflow_user', JSON.stringify(u))
    setToast(
      `Acesso de demonstração: ${role === 'CLIENTE' ? 'cliente' : role === 'BANCO' ? 'agente bancário' : 'agente'}`,
    )
  }
  const logout = () => {
    if (user?.api) request('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    setAuthVisible(false)
    localStorage.removeItem('rentflow_user')
    setView('Início')
  }
  const openOrder = (vehicle) => {
    setCar(vehicle)
    setModal('new')
  }
  const createOrder = async (values) => {
    let item = {
      id: `AL-${String(Date.now()).slice(-4)}`,
      car: car.name,
      type: car.type,
      image: car.image,
      status: 'Em análise',
      start: new Date(`${values.start}T12:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      end: new Date(`${values.end}T12:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      total: values.days * car.price,
      created: new Date().toLocaleDateString('pt-BR'),
      owner: user.name,
      details: values,
    }
    if (user.api) {
      try {
        const result = await request('/pedidos', {
          method: 'POST',
          body: JSON.stringify({
            veiculo: car.name,
            dataInicio: values.start,
            dataFim: values.end,
            valorTotal: item.total,
          }),
        })
        item = apiOrder(result, cars)
      } catch (error) {
        return setToast(error.message || 'Não foi possível enviar o pedido pela API.')
      }
    }
    ordersRequestVersion.current += 1
    setOrdersLoading(false)
    setOrders((current) => [item, ...current.filter((order) => order.id !== item.id)])
    setOrdersError('')
    setHasUnreadNotification(true)
    setModal('')
    setView('Pedidos')
    setToast('Pedido enviado para análise!')
  }
  const updateOrder = async (id, patch) => {
    const order = orders.find((o) => o.id === id)
    if (user.api && order?.apiId) {
      try {
        if (user.role === 'BANCO' && patch.contract) {
          await request(`/contratos/pedido/${order.apiId}/executar`, { method: 'POST' })
        } else {
          const apiStatus = {
            'Em análise': 'EM_ANALISE',
            Aprovado: 'APROVADO',
            Reprovado: 'REPROVADO',
            Cancelado: 'CANCELADO',
            Concluído: 'CONCLUIDO',
          }
          await request(`/pedidos/${order.apiId}`, {
            method: 'PATCH',
            body: JSON.stringify({
              status: apiStatus[patch.status],
              parecerFinanceiro: patch.parecerFinanceiro,
              observacao: patch.details?.note,
            }),
          })
        }
      } catch (error) {
        return setToast(error.message || 'Não foi possível atualizar o pedido pela API.')
      }
    }
    if (user.api) {
      ordersRequestVersion.current += 1
      setOrdersLoading(false)
      setOrdersError('')
    }
    setOrders((current) => current.map((o) => (o.id === id ? { ...o, ...patch } : o)))
    setHasUnreadNotification(true)
    setModal('')
    setToast(
      patch.contract && user.role === 'BANCO'
        ? 'Contrato ativado e disponível na aba Contratos.'
        : patch.status === 'Aprovado'
          ? 'Pedido aprovado. O contrato está aguardando formalização bancária.'
          : 'Pedido atualizado.',
    )
  }
  const openContract = (order) => {
    const savedContract = contracts.find(
      (contract) =>
        contract.orderId === order.id ||
        (order.apiId && String(contract.orderId) === `AL-${order.apiId}`),
    )
    if (savedContract) {
      setSelected(null)
      setSelectedContract(savedContract)
      return
    }
    if (['Aprovado', 'Concluído'].includes(order.status)) {
      setSelected(null)
      setSelectedContract({
        ...order,
        id: `CT-${order.apiId || order.id}`,
        orderId: order.id,
        client: order.owner,
        email: order.email || user.email,
        status: order.status === 'Concluído' ? 'Ativo' : 'Aguardando banco',
      })
      return
    }
    setToast('O contrato fica disponível depois que o pedido for aprovado.')
  }
  if (!user) {
    if (!authVisible)
      return (
        <LandingPage
          onAccess={() => {
            setAuthInitialMode('login')
            setAuthVisible(true)
          }}
          onRegister={() => {
            setAuthInitialMode('register')
            setAuthVisible(true)
          }}
        />
      )

    return (
      <Auth
        onLogin={signIn}
        onRegister={signUp}
        onDemo={demo}
        demoEnabled={!apiConfigured}
        initialMode={authInitialMode}
        onBack={() => setAuthVisible(false)}
      />
    )
  }
  const agent = ['AGENTE', 'BANCO'].includes(user.role)
  const nav = [
    {
      group: 'MENU PRINCIPAL',
      items: [
        ['Início', LayoutDashboard],
        ['Pedidos', ClipboardList],
        ...(agent ? [['Avaliações', ShieldCheck]] : []),
        ['Contratos', FileCheck2],
      ],
    },
    {
      group: 'PREFERÊNCIAS',
      items: [
        ['Configurações', Settings],
        ['Ajuda', CircleHelp],
      ],
    },
  ]
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobile ? 'show' : ''}`}>
        <div className="brand">
          <span className="brand-mark">
            <img src="/rentflow-mark.svg" alt="" />
          </span>
          <span>
            Rent<span className="brand-light">Flow</span>
            <small>ALUGUEL SIMPLES</small>
          </span>
        </div>
        <button className="close-sidebar" onClick={() => setMobile(false)}>
          <X />
        </button>
        <div className="sidebar-label">SEU ESPAÇO</div>
        <button className="profile profile-button" onClick={() => setModal('account')}>
          <div className="avatar">{initials(user.name)}</div>
          <div className="profile-info">
            <b>{user.name}</b>
            <span>{roleLabel(user.role)}</span>
          </div>
          <ChevronDown size={15} />
        </button>
        {nav.map((section) => (
          <div className="nav-section" key={section.group}>
            <div className="nav-caption">{section.group}</div>
            {section.items.map(([name, Icon]) => (
              <button
                key={name}
                className={`nav-item ${view === name ? 'active' : ''}`}
                onClick={() => navigate(name)}
              >
                <Icon size={18} />
                <span>{name}</span>
                {name === 'Pedidos' && <span className="nav-count">{mine.length}</span>}
              </button>
            ))}
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={16} />
            </div>
            <b>Precisa de ajuda?</b>
            <span>Estamos aqui para você.</span>
            <button onClick={() => setView('Ajuda')}>
              Falar com suporte <ArrowRight size={14} />
            </button>
          </div>
          <button className="logout" onClick={logout}>
            <LogOut size={17} /> Sair da conta
          </button>
          <span className="version">RentFlow v1.0 · 2026</span>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <div className="breadcrumbs">
            Espaço do cliente <span>/</span> <b>{view}</b>
          </div>
          <div className="top-actions">
            <div className="top-date">
              <CalendarDays size={15} />{' '}
              {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <button
              className="icon-button notification"
              onClick={() => {
                setHasUnreadNotification(false)
                setToast(
                  hasUnreadNotification
                    ? 'Você visualizou as atualizações.'
                    : 'Você está em dia! Nenhuma notificação nova.',
                )
              }}
              aria-label={hasUnreadNotification ? 'Notificações não lidas' : 'Notificações'}
            >
              <Bell size={18} />
              {hasUnreadNotification && <i />}
            </button>
            <div className="top-divider" />
            <button className="top-user" onClick={() => setModal('account')}>
              <div className="avatar small">{initials(user.name)}</div>
              <span>{user.name.split(' ')[0]}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <div className="page-wrap">
          {view === 'Início' ? (
            <Dashboard
              user={user}
              orders={mine}
              cars={cars}
              carsLoading={carsLoading}
              agent={agent}
              navigate={navigate}
              openOrder={openOrder}
              setSelected={setSelected}
              setModal={setModal}
              setToast={setToast}
            />
          ) : view === 'Pedidos' || view === 'Avaliações' ? (
            <OrdersPage
              orders={filtered}
              allCount={mine.length}
              loading={user.api && ordersLoading}
              error={user.api ? ordersError : ''}
              onRefresh={() => setOrdersRefresh((value) => value + 1)}
              agent={agent}
              query={query}
              setQuery={setQuery}
              filter={filter}
              setFilter={setFilter}
              setSelected={setSelected}
              setModal={setModal}
              navigate={navigate}
            />
          ) : view === 'Contratos' ? (
            <ContractsPage
              orders={mine}
              contracts={user.api ? contracts : null}
              loading={user.api && contractsLoading}
              error={user.api ? contractsError : ''}
              onOpenContract={openContract}
              onRefresh={() => setContractsRefresh((value) => value + 1)}
            />
          ) : view === 'Configurações' ? (
            <SettingsPage
              user={user}
              setToast={setToast}
              onSaveUser={(data) => {
                const next = { ...user, ...data }
                setUser(next)
                localStorage.setItem('rentflow_user', JSON.stringify(next))
              }}
            />
          ) : (
            <HelpPage setToast={setToast} />
          )}
        </div>
      </main>
      {selected && (
        <DetailModal
          order={selected}
          agent={agent}
          role={user.role}
          setToast={setToast}
          onViewContract={openContract}
          onClose={() => setSelected(null)}
          onUpdate={(patch) => {
            updateOrder(selected.id, patch)
            setSelected(null)
          }}
          onEdit={() => {
            setEditTarget(selected)
            setSelected(null)
            setModal('edit')
          }}
        />
      )}
      {selectedContract && (
        <ContractModal contract={selectedContract} onClose={() => setSelectedContract(null)} />
      )}
      {modal === 'new' && (
        <OrderModal car={car} onClose={() => setModal('')} onSubmit={createOrder} />
      )}
      {modal === 'edit' && (
        <EditModal
          order={editTarget}
          onClose={() => setModal('')}
          onSubmit={(v) => updateOrder(editTarget.id, v)}
        />
      )}
      {modal === 'account' && (
        <AccountModal user={user} onClose={() => setModal('')} onLogout={logout} />
      )}
      {toast && (
        <div className="toast">
          <span>
            <Check size={15} />
          </span>
          {toast}
          <button onClick={() => setToast('')}>
            <X size={15} />
          </button>
        </div>
      )}
      {mobile && <div className="mobile-backdrop" onClick={() => setMobile(false)} />}
    </div>
  )
}
function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
function hello() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
}
function roleLabel(role) {
  return role === 'AGENTE'
    ? 'Agente de análise'
    : role === 'BANCO'
      ? 'Agente bancário'
      : 'Cliente premium'
}
function Status({ value }) {
  return (
    <span className={`status ${statuses[value] || 'pending'}`}>
      <i />
      {value}
    </span>
  )
}
function Dashboard({
  user,
  orders,
  cars,
  carsLoading,
  agent,
  navigate,
  openOrder,
  setSelected,
  setModal,
  setToast,
}) {
  const pending = orders.filter((o) => o.status === 'Em análise').length,
    approved = orders.filter((o) => o.status === 'Aprovado' || o.status === 'Concluído').length,
    spent = orders
      .filter((o) => o.status === 'Concluído' || o.status === 'Aprovado')
      .reduce((s, o) => s + o.total, 0)
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />{' '}
            {new Date()
              .toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
              .toUpperCase()}
          </div>
          <h1>
            {hello()}, {user.name.split(' ')[0]} <span className="wave">✦</span>
          </h1>
          <p>
            {agent
              ? 'Acompanhe e avalie as solicitações de aluguel.'
              : 'Pronto para encontrar seu próximo destino?'}
          </p>
        </div>
        <button
          className="button primary"
          onClick={() =>
            agent
              ? navigate('Avaliações')
              : document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <Plus size={17} />
          {agent ? 'Revisar pedidos' : 'Novo aluguel'}
        </button>
      </div>
      <div className="stats-grid">
        <StatCard
          icon={ClipboardList}
          label={agent ? 'Pedidos para avaliar' : 'Pedidos ativos'}
          value={
            agent
              ? pending
              : orders.filter((o) => ['Em análise', 'Aprovado'].includes(o.status)).length
          }
          change={agent ? 'Aguardando análise' : 'Solicitações em andamento'}
          tone="blue"
        />
        <StatCard
          icon={Check}
          label="Pedidos aprovados"
          value={approved}
          change="Este ano"
          tone="green"
        />
        <StatCard
          icon={WalletCards}
          label={agent ? 'Valor em análise' : 'Total em aluguéis'}
          value={money(
            agent
              ? orders.filter((o) => o.status === 'Em análise').reduce((s, o) => s + o.total, 0)
              : spent,
          )}
          change={agent ? 'Solicitações pendentes' : 'Em 2025'}
          tone="purple"
        />
        <StatCard
          icon={Activity}
          label="Taxa de aprovação"
          value={`${orders.length ? Math.round((approved / orders.length) * 100) : 0}%`}
          change="Nos seus pedidos"
          tone="orange"
        />
      </div>
      <div className="content-grid">
        <section className="panel orders-panel">
          <div className="panel-heading">
            <div>
              <h2>{agent ? 'Pedidos recentes' : 'Pedidos recentes'}</h2>
              <p>
                {agent
                  ? 'Solicitações que precisam da sua atenção'
                  : 'Acompanhe o status das suas solicitações'}
              </p>
            </div>
            <button
              className="text-link"
              onClick={() => navigate(agent ? 'Avaliações' : 'Pedidos')}
            >
              Ver todos <ArrowRight size={15} />
            </button>
          </div>
          {orders.length ? (
            <div className="orders-table">
              <div className="table-head">
                <span>VEÍCULO</span>
                <span>PERÍODO</span>
                <span>VALOR</span>
                <span>STATUS</span>
                <span />
              </div>
              {orders.slice(0, 4).map((o) => (
                <button className="order-row" key={o.id} onClick={() => setSelected(o)}>
                  <div className="vehicle-cell">
                    <img src={o.image} alt="" />
                    <div>
                      <b>{o.car}</b>
                      <span>{o.id}</span>
                    </div>
                  </div>
                  <div className="period-cell">
                    <b>{o.start}</b>
                    <span>até {o.end}</span>
                  </div>
                  <b className="amount">{money(o.total)}</b>
                  <Status value={o.status} />
                  <ArrowRight className="row-arrow" size={16} />
                </button>
              ))}
            </div>
          ) : (
            <Empty
              title="Ainda não há pedidos"
              text="Encontre um carro e faça sua primeira solicitação."
              action={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })}
              label="Explorar carros"
            />
          )}
          <button className="mobile-view-all" onClick={() => navigate('Pedidos')}>
            Ver todos os pedidos <ArrowRight size={15} />
          </button>
        </section>
        <section className="side-column">
          <div className="spend-card">
            <div className="spend-top">
              <div>
                <span>{agent ? 'Pedidos aguardando' : 'GASTOS COM ALUGUEL'}</span>
                <b>{agent ? pending : money(spent)}</b>
              </div>
              <span className="spend-icon">
                <WalletCards size={19} />
              </span>
            </div>
            <div className="spend-graph">
              <div className="graph-labels">
                <span>JAN</span>
                <span>FEV</span>
                <span>MAR</span>
                <span>ABR</span>
                <span>MAI</span>
                <span>JUN</span>
              </div>
              <div className="bars">
                {[34, 50, 42, 67, 48, 78, 57, 91, 65, 75, 53, 86].map((h, i) => (
                  <i style={{ height: `${h}%` }} className={i === 11 ? 'bright' : ''} key={i} />
                ))}
              </div>
            </div>
            <div className="spend-foot">
              <span>
                <i /> {agent ? 'Visão geral de solicitações' : 'Aluguéis em 2025'}
              </span>
              <span className="trend">
                <ArrowUpRight size={13} /> 12%
              </span>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-head">
              <span>
                <ShieldCheck size={15} />
              </span>{' '}
              DICA RENTFLOW
            </div>
            <h3>Vai alugar pela primeira vez?</h3>
            <p>Tenha seus documentos em mãos e confira os dados antes de enviar a solicitação.</p>
            <button onClick={() => setModal('account')}>
              Ver meu perfil <ArrowRight size={14} />
            </button>
            <div className="tip-art">
              <CarFront size={72} />
              <span />
            </div>
          </div>
        </section>
      </div>
      <section className="cars-section" id="cars">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ESCOLHA O SEU PRÓXIMO CARRO</div>
            <h2>Encontre seu próximo destino.</h2>
            <p>Veículos selecionados para deixar sua viagem ainda melhor.</p>
          </div>
          <button
            className="text-link"
            onClick={() => setToast('Novas opções de veículos em breve.')}
          >
            Ver todos os veículos <ArrowRight size={15} />
          </button>
        </div>
        <div className="car-grid">
          {carsLoading ? (
            <div className="catalog-message">Carregando veículos...</div>
          ) : cars.length ? (
            cars.map((c) => (
              <article className="car-card" key={c.id}>
                <div className="car-image" style={{ background: c.color }}>
                  <img src={c.image} alt={c.name} />
                  <span>{c.tag}</span>
                  <button
                    onClick={() => setToast('Veículo salvo nos favoritos.')}
                    aria-label="Favoritar"
                  >
                    ♡
                  </button>
                </div>
                <div className="car-info">
                  <div>
                    <h3>{c.name}</h3>
                    <span>{c.type}</span>
                  </div>
                  <div className="car-price">
                    <b>{money(c.price)}</b>
                    <span>/ dia</span>
                  </div>
                </div>
                <div className="car-bottom">
                  <span>
                    <Check size={13} /> Proteção inclusa
                  </span>
                  <button onClick={() => openOrder(c)}>
                    Reservar <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="catalog-message">
              Nenhum veículo disponível no momento. Tente novamente mais tarde.
            </div>
          )}
        </div>
      </section>
    </>
  )
}
function StatCard({ icon: Icon, label, value, change, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <span className="stat-label">{label}</span>
      <b className="stat-value">{value}</b>
      <span className="stat-change">
        <i className={tone} />
        {change}
      </span>
    </div>
  )
}
function OrdersPage({
  orders,
  allCount,
  loading,
  error,
  onRefresh,
  agent,
  query,
  setQuery,
  filter,
  setFilter,
  setSelected,
  navigate,
}) {
  return (
    <>
      <div className="page-title-row">
        <div>
          <div className="eyebrow">GESTÃO DE SOLICITAÇÕES</div>
          <h1>{agent ? 'Central de pedidos' : 'Meus pedidos'}</h1>
          <p>
            {agent
              ? 'Avalie as solicitações e acompanhe o fluxo dos contratos.'
              : 'Acompanhe cada etapa dos seus pedidos de aluguel.'}
          </p>
        </div>
        <button
          className="button primary"
          onClick={() => (agent ? onRefresh() : navigate('Início'))}
        >
          <SlidersHorizontal size={16} />
          {agent ? 'Atualizar lista' : 'Novo pedido'}
        </button>
      </div>
      <div className="filter-tabs">
        {['Todos', 'Em análise', 'Aprovado', 'Reprovado', 'Concluído', 'Cancelado'].map((f) => (
          <button className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)} key={f}>
            {f}
            <span>{f === 'Todos' ? allCount : orders.filter((o) => o.status === f).length}</span>
          </button>
        ))}
      </div>
      <div className="panel full-orders">
        <div className="list-toolbar">
          <div>
            <h2>{agent ? 'Solicitações' : 'Suas solicitações'}</h2>
            <span>
              {orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
            </span>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por veículo ou código"
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>
        {loading ? (
          <div className="contract-loading">Carregando pedidos...</div>
        ) : error ? (
          <Empty
            title="Não foi possível carregar os pedidos"
            text={`${error} Atualize a página ou entre novamente na conta.`}
          />
        ) : orders.length ? (
          <div className="orders-table">
            <div className="table-head">
              <span>VEÍCULO</span>
              <span>PERÍODO</span>
              <span>VALOR</span>
              <span>STATUS</span>
              <span />
            </div>
            {orders.map((o) => (
              <button className="order-row" key={o.id} onClick={() => setSelected(o)}>
                <div className="vehicle-cell">
                  <img src={o.image} alt="" />
                  <div>
                    <b>{o.car}</b>
                    <span>
                      {o.id} · {o.created}
                    </span>
                  </div>
                </div>
                <div className="period-cell">
                  <b>{o.start}</b>
                  <span>até {o.end}</span>
                </div>
                <b className="amount">{money(o.total)}</b>
                <Status value={o.status} />
                <ArrowRight className="row-arrow" size={16} />
              </button>
            ))}
          </div>
        ) : (
          <Empty
            title="Nenhum pedido por aqui"
            text="Quando você tiver uma solicitação, ela aparecerá nesta lista."
          />
        )}
      </div>
    </>
  )
}
function ContractsPage({ orders, contracts, loading, error, onOpenContract, onRefresh }) {
  const documents = [
    ...(contracts ?? []),
    ...orders
      .filter((order) => ['Aprovado', 'Concluído'].includes(order.status))
      .filter((order) => !contracts?.some((contract) => contract.orderId === order.id))
      .map((order) => ({
        ...order,
        id: `CT-${order.apiId || order.id}`,
        orderId: order.id,
        client: order.owner,
        status: order.status === 'Concluído' ? 'Ativo' : 'Aguardando banco',
      })),
  ]
  return (
    <>
      <div className="page-title-row">
        <div>
          <div className="eyebrow">DOCUMENTOS E LOCAÇÕES</div>
          <h1>Seus contratos</h1>
          <p>Consulte os contratos ativos e os aprovados que aguardam formalização.</p>
        </div>
        <button className="button outline" onClick={onRefresh}>
          <RefreshCw size={16} /> Atualizar
        </button>
      </div>
      <div className="panel full-orders">
        <div className="list-toolbar">
          <div>
            <h2>Contratos e formalização</h2>
            <span>{documents.length} documentos disponíveis</span>
          </div>
        </div>
        {loading ? (
          <div className="contract-loading">Carregando contratos...</div>
        ) : error ? (
          <Empty
            title="Não foi possível carregar os contratos"
            text={`${error} Atualize a página ou entre novamente na conta.`}
          />
        ) : documents.length ? (
          documents.map((contract) => (
            <div className="contract-row" key={contract.id}>
              <div className="contract-icon">
                <FileCheck2 />
              </div>
              <div className="contract-name">
                <b>Contrato de aluguel · {contract.car}</b>
                <span>
                  {contract.id} · Emitido em {contract.created}
                </span>
              </div>
              <Status value={contract.status} />
              <button
                className="button outline small-button"
                onClick={() => onOpenContract(contract)}
              >
                Ver contrato <ArrowRight size={14} />
              </button>
            </div>
          ))
        ) : (
          <Empty
            title="Nenhum contrato disponível"
            text="Quando um pedido for aprovado, o contrato aparecerá aqui aguardando formalização bancária."
          />
        )}
      </div>
    </>
  )
}
function contractPdf(contract) {
  const clean = (value) =>
    String(value ?? '—')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x20-\x7E]/g, ' ')
  const escape = (value) =>
    clean(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  const fields = [
    ['Contrato', contract.id],
    ['Pedido relacionado', contract.orderId],
    ['Status', contract.status],
    ['Cliente', contract.client],
    ['E-mail', contract.email],
    ['Veículo', contract.car],
    ['Categoria', contract.type],
    ['Data de retirada', contract.start],
    ['Data de devolução', contract.end],
    ['Valor total', money(contract.total)],
    ['Data de emissão', contract.created],
  ]
  const stream = [
    'BT /F1 20 Tf 48 790 Td (RENTFLOW) Tj ET',
    `BT /F1 15 Tf 48 760 Td (${escape(
      contract.status === 'Aguardando banco'
        ? 'RESUMO DO CONTRATO DE LOCACAO'
        : 'CONTRATO DE LOCACAO DE VEICULO',
    )}) Tj ET`,
    '0.75 w 48 744 m 547 744 l S',
  ]
  let y = 720
  for (const [label, value] of fields) {
    const line = `${label}: ${clean(value)}`
    const words = line.split(/\s+/)
    let current = ''
    const wrapped = []
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (candidate.length > 72 && current) {
        wrapped.push(current)
        current = word
      } else current = candidate
    }
    if (current) wrapped.push(current)
    for (const part of wrapped) {
      stream.push(`BT /F1 10 Tf 52 ${y} Td (${escape(part)}) Tj ET`)
      y -= 19
    }
    y -= 3
  }
  stream.push(
    `BT /F1 9 Tf 52 ${Math.max(y - 10, 80)} Td (Documento gerado pelo RentFlow com os dados registrados no sistema.) Tj ET`,
  )
  const content = stream.join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return new Blob([new TextEncoder().encode(pdf)], { type: 'application/pdf' })
}

function ContractModal({ contract, onClose }) {
  const downloadContract = () => {
    const url = URL.createObjectURL(contractPdf(contract))
    const link = document.createElement('a')
    const fileId = String(contract.id || contract.orderId || 'rentflow').replace(
      /[^a-z0-9_-]/gi,
      '-',
    )
    link.href = url
    link.download = `Contrato-${fileId}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <Modal onClose={onClose} wide>
      <div className="modal-eyebrow">CONTRATO DE LOCAÇÃO · {contract.id}</div>
      <div className="contract-modal-heading">
        <div>
          <h2>Contrato de aluguel</h2>
          <p>Documento referente ao pedido {contract.orderId}.</p>
        </div>
        <Status value={contract.status} />
      </div>
      <div className="contract-modal-car">
        <img src={contract.image} alt={contract.car} />
        <div>
          <span>VEÍCULO CONTRATADO</span>
          <b>{contract.car}</b>
          <small>{contract.type}</small>
        </div>
      </div>
      <div className="contract-info-grid">
        <div>
          <span>Cliente</span>
          <b>{contract.client || '—'}</b>
        </div>
        <div>
          <span>E-mail cadastrado</span>
          <b>{contract.email || '—'}</b>
        </div>
        <div>
          <span>Retirada</span>
          <b>{contract.start}</b>
        </div>
        <div>
          <span>Devolução</span>
          <b>{contract.end}</b>
        </div>
        <div>
          <span>Valor total</span>
          <b>{money(contract.total)}</b>
        </div>
        <div>
          <span>Data de emissão</span>
          <b>{contract.created}</b>
        </div>
      </div>
      <div className="contract-modal-note">
        <ShieldCheck size={17} />
        <span>
          {contract.status === 'Aguardando banco'
            ? 'Pedido aprovado. O agente bancário precisa conceder o crédito para ativar o contrato.'
            : `Este contrato ativo está vinculado ao pedido ${contract.orderId}.`}
        </span>
      </div>
      <button className="button primary full-button" onClick={downloadContract}>
        <Download size={16} />
        {contract.status === 'Aguardando banco' ? 'Baixar resumo em PDF' : 'Baixar contrato em PDF'}
      </button>
    </Modal>
  )
}
function SettingsPage({ user, setToast, onSaveUser }) {
  const [draft, setDraft] = useState({
    name: user.name,
    cpf: user.cpf || '',
    rg: user.rg || '',
    address: user.address || '',
    profession: user.profession || '',
  })
  useEffect(() => {
    if (user.api)
      request('/clientes/me')
        .then((data) =>
          setDraft({
            name: data.nome,
            cpf: data.cpf,
            rg: data.rg,
            address: data.endereco,
            profession: data.profissao,
          }),
        )
        .catch(() => setToast('Não foi possível carregar seu perfil pela API.'))
  }, [user.api])
  const save = async (e) => {
    e.preventDefault()
    if (user.api) {
      try {
        await request('/clientes/me', {
          method: 'PUT',
          body: JSON.stringify({
            nome: draft.name,
            cpf: draft.cpf,
            rg: draft.rg,
            endereco: draft.address,
            profissao: draft.profession,
          }),
        })
      } catch {
        return setToast('Não foi possível atualizar seu perfil pela API.')
      }
    }
    onSaveUser(draft)
    setToast('Seus dados foram atualizados.')
  }
  return (
    <>
      <div className="page-title-row">
        <div>
          <div className="eyebrow">SUA CONTA RENTFLOW</div>
          <h1>Meu perfil</h1>
          <p>Atualize seus dados pessoais e informações de contato.</p>
        </div>
      </div>
      <div className="panel settings-panel">
        <div className="settings-profile">
          <div className="avatar large">{initials(user.name)}</div>
          <div>
            <h2>{user.name}</h2>
            <span>{user.email}</span>
          </div>
          <span className="verified">
            <ShieldCheck size={14} /> Conta ativa
          </span>
        </div>
        <form className="profile-form" onSubmit={save}>
          <div className="profile-fields">
            <label>
              Nome completo
              <input
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label>
              CPF
              <input
                value={draft.cpf}
                onChange={(e) => setDraft({ ...draft, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </label>
            <label>
              RG
              <input
                value={draft.rg}
                onChange={(e) => setDraft({ ...draft, rg: e.target.value })}
              />
            </label>
            <label>
              Profissão
              <input
                value={draft.profession}
                onChange={(e) => setDraft({ ...draft, profession: e.target.value })}
              />
            </label>
            <label className="wide-field">
              Endereço
              <input
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              />
            </label>
            <label className="wide-field">
              E-mail
              <input value={user.email} disabled />
            </label>
          </div>
          <button className="button primary">
            <Check size={15} /> Salvar alterações
          </button>
        </form>
        <div className="settings-divider">
          <span>SEGURANÇA E PREFERÊNCIAS</span>
        </div>
        <button
          className="settings-row"
          onClick={() =>
            setToast(
              'Sua senha é armazenada com proteção. Para alterá-la, fale com a equipe de suporte RentFlow.',
            )
          }
        >
          <div>
            <b>Segurança da conta</b>
            <span>Senha protegida e acesso à conta.</span>
          </div>
          <ArrowRight size={17} />
        </button>
        <button
          className="settings-row"
          onClick={() => setToast('Você receberá atualizações do status dos pedidos nesta tela.')}
        >
          <div>
            <b>Notificações</b>
            <span>Atualizações sobre suas solicitações e contratos.</span>
          </div>
          <ArrowRight size={17} />
        </button>
      </div>
    </>
  )
}
function HelpPage({ setToast }) {
  return (
    <>
      <div className="page-title-row">
        <div>
          <div className="eyebrow">SUPORTE RENTFLOW</div>
          <h1>Como podemos ajudar?</h1>
          <p>Encontre respostas rápidas para sua próxima viagem.</p>
        </div>
      </div>
      <div className="help-grid">
        {[
          [
            'Como faço uma reserva?',
            'Escolha um veículo na página inicial, informe as datas e envie sua solicitação.',
          ],
          [
            'Quanto tempo leva a aprovação?',
            'A equipe analisa os dados financeiros e atualiza o status do pedido.',
          ],
          [
            'Posso cancelar um pedido?',
            'Sim. Abra o pedido e selecione cancelar enquanto ele não estiver concluído.',
          ],
          ['Precisa de mais ajuda?', 'Nossa equipe está disponível para ajudar com seu aluguel.'],
        ].map(([a, b], i) => (
          <div className="panel faq-card" key={a}>
            <span className="faq-number">0{i + 1}</span>
            <h3>{a}</h3>
            <p>{b}</p>
            <button onClick={() => setToast('Fale com a equipe de suporte RentFlow')}>
              Saiba mais <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
function Empty({ title, text, action, label }) {
  return (
    <div className="empty-state">
      <span>
        <ClipboardList size={21} />
      </span>
      <b>{title}</b>
      <p>{text}</p>
      {action && (
        <button className="button outline" onClick={action}>
          {label || 'Ver opções'}
        </button>
      )}
    </div>
  )
}
function LandingPage({ onAccess, onRegister }) {
  const features = [
    {
      icon: CarFront,
      number: '01',
      title: 'Encontre seu carro',
      text: 'Veja opções de veículos, compare categorias e escolha o que combina com sua viagem.',
      tone: 'teal',
    },
    {
      icon: ClipboardList,
      number: '02',
      title: 'Acompanhe pedidos',
      text: 'Consulte datas, valores e o andamento de cada solicitação em um só lugar.',
      tone: 'blue',
    },
    {
      icon: ShieldCheck,
      number: '03',
      title: 'Análise organizada',
      text: 'A equipe responsável avalia solicitações e atualiza o cliente sobre cada etapa.',
      tone: 'amber',
    },
    {
      icon: FileCheck2,
      number: '04',
      title: 'Contratos acessíveis',
      text: 'Consulte os contratos relacionados aos pedidos aprovados sem perder o histórico.',
      tone: 'violet',
    },
  ]

  return (
    <main className="public-page">
      <header className="public-nav">
        <a className="public-brand" href="#inicio" aria-label="RentFlow, início">
          <span className="brand-mark">
            <img src="/rentflow-mark.svg" alt="" />
          </span>
          <span>
            Rent<span className="brand-light">Flow</span>
            <small>ALUGUEL SIMPLES</small>
          </span>
        </a>
        <nav className="public-links" aria-label="Navegação principal">
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#etapas">Como funciona</a>
        </nav>
        <div className="public-nav-actions">
          <button className="public-login" onClick={onAccess}>
            Entrar
          </button>
          <button className="button primary" onClick={onRegister}>
            Criar conta <ArrowRight size={15} />
          </button>
        </div>
      </header>

      <section className="public-hero" id="inicio">
        <div className="public-hero-copy">
          <span className="public-eyebrow">
            <i /> MOBILIDADE DO SEU JEITO
          </span>
          <h1>
            A estrada chama.
            <span>O carro certo está aqui.</span>
          </h1>
          <p>
            Escolha um veículo, solicite seu aluguel e acompanhe cada etapa da reserva com clareza.
          </p>
          <div className="public-hero-actions">
            <button className="button primary" onClick={onRegister}>
              Começar agora <ArrowRight size={16} />
            </button>
            <a className="public-text-link" href="#funcionalidades">
              Conhecer o RentFlow <ArrowDownLeft size={15} />
            </a>
          </div>
          <div className="public-trust-row">
            <span>
              <Check size={15} /> Pedidos em um só lugar
            </span>
            <span>
              <Check size={15} /> Acompanhamento simples
            </span>
          </div>
        </div>
        <div className="public-hero-visual">
          <img
            className="public-car-photo"
            src={initialCars[0].image}
            alt="Carro disponível para aluguel"
          />
          <div className="public-photo-label">
            <span className="public-photo-icon">
              <CarFront size={19} />
            </span>
            <span>
              <small>ESCOLHA SEU PRÓXIMO DESTINO</small>
              <b>Uma viagem começa com uma boa escolha.</b>
            </span>
          </div>
          <div className="public-photo-index">
            RENTFLOW <b>01 / 04</b>
          </div>
        </div>
      </section>

      <section className="public-features" id="funcionalidades">
        <div className="public-section-heading">
          <div>
            <span className="public-eyebrow">TUDO MAIS ORGANIZADO</span>
            <h2>Do primeiro clique à próxima viagem.</h2>
          </div>
          <p>Conheça o que você pode fazer no RentFlow, antes mesmo de entrar.</p>
        </div>
        <div className="public-feature-grid">
          {features.map(({ icon: Icon, number, title, text, tone }) => (
            <article className="public-feature-card" key={number}>
              <div className={`public-feature-icon ${tone}`}>
                <Icon size={20} />
              </div>
              <span className="public-feature-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <button onClick={onAccess} aria-label={`Entrar para ${title.toLowerCase()}`}>
                Explorar <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="public-steps" id="etapas">
        <div>
          <span className="public-eyebrow">SIMPLES ASSIM</span>
          <h2>Três passos para seguir viagem.</h2>
        </div>
        <div className="public-step-list">
          {[
            ['01', 'Crie sua conta', 'Informe seus dados para começar.'],
            ['02', 'Escolha e solicite', 'Selecione o carro e as datas do aluguel.'],
            ['03', 'Acompanhe o pedido', 'Veja a análise e as atualizações da equipe.'],
          ].map(([number, title, text]) => (
            <article className="public-step" key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
        <button className="button public-final-cta" onClick={onRegister}>
          Criar minha conta <ArrowRight size={16} />
        </button>
      </section>

      <footer className="public-footer">
        <span>© 2026 RentFlow · Mobilidade do seu jeito</span>
        <button onClick={onAccess}>Já tem uma conta? Entrar</button>
      </footer>
    </main>
  )
}

function Auth({ onLogin, onRegister, onDemo, demoEnabled, initialMode, onBack }) {
  const [mode, setMode] = useState(initialMode || 'login'),
    [show, setShow] = useState(false),
    [error, setError] = useState(''),
    [submitting, setSubmitting] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const d = Object.fromEntries(new FormData(e.currentTarget))
    if (mode === 'register') {
      if (d.password.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.')
      const rendimentos = [1, 2, 3]
        .filter((i) => d[`empregador${i}`]?.trim())
        .map((i) => ({ empregador: d[`empregador${i}`], valor: Number(d[`renda${i}`] || 0) }))
      const account = {
        name: d.name,
        email: d.email,
        password: d.password,
        role: d.role,
        cpf: d.cpf,
        rg: d.rg,
        address: d.address,
        profession: d.profession,
        rendimentos,
      }
      setSubmitting(true)
      try {
        const result = await onRegister(account)
        if (result?.error) setError(result.error)
      } catch {
        setError('Não foi possível concluir o cadastro. Verifique os dados e tente novamente.')
      } finally {
        setSubmitting(false)
      }
      return
    }
    setSubmitting(true)
    try {
      const result = await onLogin(d.email, d.password)
      if (result?.error) setError(result.error)
    } catch {
      setError('Não foi possível concluir o login. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-mark">
            <img src="/rentflow-mark.svg" alt="" />
          </span>
          <span>
            Rent<span className="brand-light">Flow</span>
          </span>
        </div>
        <div className="auth-pitch">
          <h1>
            Alugue e siga <i>seu caminho.</i>
          </h1>
          <p>Escolha o carro. Acompanhe sua reserva. Aproveite a viagem.</p>
        </div>
        <span className="auth-copyright">© 2026 RentFlow · Mobilidade do seu jeito</span>
        <div className="auth-car-art">
          <CarFront size={170} />
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <button className="auth-back" onClick={onBack}>
            <ArrowLeft size={15} /> Voltar ao início
          </button>
          <div className="auth-mobile-brand">
            <span className="brand-mark">
              <img src="/rentflow-mark.svg" alt="" />
            </span>
            Rent<span>Flow</span>
          </div>
          <div className="auth-form-header">
            <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
            {mode === 'register' && <p>Preencha seus dados para continuar.</p>}
          </div>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={submit} className="auth-form">
            {mode === 'register' && (
              <>
                <label>
                  Nome completo
                  <input name="name" required placeholder="Como podemos te chamar?" />
                </label>
                <div className="register-grid">
                  <label>
                    CPF
                    <input name="cpf" placeholder="000.000.000-00" />
                  </label>
                  <label>
                    RG
                    <input name="rg" placeholder="Documento de identidade" />
                  </label>
                </div>
                <label>
                  Endereço
                  <input name="address" placeholder="Rua, número, cidade" />
                </label>
                <div className="register-grid">
                  <label>
                    Profissão
                    <input name="profession" placeholder="Sua profissão" />
                  </label>
                  <label>
                    Perfil de acesso
                    <select name="role">
                      <option value="CLIENTE">Cliente</option>
                      <option value="AGENTE">Agente</option>
                      <option value="BANCO">Agente bancário</option>
                    </select>
                  </label>
                </div>
                <details className="income-details">
                  <summary>Adicionar rendimentos (opcional, até 3)</summary>
                  {[1, 2, 3].map((i) => (
                    <div className="register-grid income-row" key={i}>
                      <label>
                        Empregador {i}
                        <input name={`empregador${i}`} placeholder="Empresa" />
                      </label>
                      <label>
                        Renda mensal
                        <input
                          name={`renda${i}`}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="R$"
                        />
                      </label>
                    </div>
                  ))}
                </details>
              </>
            )}
            <label>
              E-mail
              <input name="email" type="email" required placeholder="voce@email.com" />
            </label>
            <label>
              Senha
              <div className="password-input">
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  minLength="6"
                  required
                  placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>
            {mode === 'login' && (
              <div className="forgot-row">
                <label className="check-label">
                  <input type="checkbox" /> Manter conectado
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setError('Entre em contato com a equipe de suporte para recuperar o acesso.')
                  }
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}
            <button className="button primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
          <div className="auth-switch">
            {mode === 'login' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}{' '}
            <button
              onClick={() => {
                setError('')
                setMode(mode === 'login' ? 'register' : 'login')
              }}
            >
              {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
            </button>
          </div>
          {demoEnabled && (
            <>
              <div className="auth-divider">
                <span /> Acesso de demonstração <span />
              </div>
              <div className="demo-buttons">
                <button onClick={() => onDemo('CLIENTE')}>
                  <div className="avatar demo-avatar">AS</div>
                  <span>
                    <b>Entrar como cliente</b>
                  </span>
                  <ArrowRight size={15} />
                </button>
                <button onClick={() => onDemo('AGENTE')}>
                  <div className="avatar demo-avatar agent-avatar">CM</div>
                  <span>
                    <b>Entrar como agente</b>
                  </span>
                  <ArrowRight size={15} />
                </button>
                <button onClick={() => onDemo('BANCO')}>
                  <div className="avatar demo-avatar bank-avatar">MO</div>
                  <span>
                    <b>Entrar como banco</b>
                  </span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
function Modal({ children, onClose, wide = false, className = '' }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-card ${wide ? 'wide' : ''} ${className}`}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}
function OrderModal({ car, onClose, onSubmit }) {
  const [start, setStart] = useState(''),
    [end, setEnd] = useState('')
  const days = start && end ? Math.ceil((new Date(end) - new Date(start)) / 86400000) : 0
  const endMin = start
    ? new Date(new Date(`${start}T12:00:00`).getTime() + 86400000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10)
  return (
    <Modal onClose={onClose}>
      <div className="modal-eyebrow">NOVA SOLICITAÇÃO</div>
      <h2>Vamos planejar seu aluguel.</h2>
      <p className="modal-subtitle">
        Escolha as datas da sua viagem. A solicitação será enviada para análise.
      </p>
      <div className="modal-car">
        <img src={car.image} alt="" />
        <div>
          <b>{car.name}</b>
          <span>{car.type}</span>
        </div>
        <strong>
          {money(car.price)}
          <small>/ dia</small>
        </strong>
      </div>
      <form
        className="modal-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({ start, end, days })
        }}
      >
        <div className="date-fields">
          <label>
            Retirada
            <input
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label>
            Devolução
            <input
              type="date"
              required
              min={endMin}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
        </div>
        {days > 0 && (
          <div className="order-summary">
            <span>
              {days} {days === 1 ? 'diária' : 'diárias'} × {money(car.price)}
            </span>
            <b>{money(days * car.price)}</b>
          </div>
        )}
        <button className="button primary full-button" disabled={!days}>
          Enviar para análise <ArrowRight size={16} />
        </button>
        <span className="modal-footnote">
          <ShieldCheck size={14} /> Você poderá acompanhar o status em Pedidos.
        </span>
      </form>
    </Modal>
  )
}
function DetailModal({ order, agent, role, onViewContract, onClose, onUpdate, onEdit }) {
  const canCancel = order.status === 'Em análise' || order.status === 'Pendente'
  return (
    <Modal onClose={onClose} wide className="contract-view-modal">
      <div className="modal-eyebrow">DETALHES DO PEDIDO · {order.id}</div>
      <div className="detail-title">
        <div>
          <h2>{order.car}</h2>
          <p>Solicitação criada em {order.created}</p>
        </div>
        <Status value={order.status} />
      </div>
      <div className="detail-photo">
        <img src={order.image} alt={order.car} />
        <span>{order.type}</span>
      </div>
      <div className="detail-grid">
        <div>
          <span>Retirada</span>
          <b>{order.start}</b>
        </div>
        <div>
          <span>Devolução</span>
          <b>{order.end}</b>
        </div>
        <div>
          <span>Valor total</span>
          <b>{money(order.total)}</b>
        </div>
        <div>
          <span>Solicitante</span>
          <b>{order.owner}</b>
        </div>
      </div>
      {order.details?.note && (
        <div className="detail-note">
          <b>Observação</b>
          <p>{order.details.note}</p>
        </div>
      )}
      {agent && order.status === 'Em análise' && (
        <div className="review-note">
          <ShieldCheck size={16} />
          <span>
            <b>Avaliação financeira</b>
            <small>Revise os dados e registre seu parecer para continuar o fluxo.</small>
          </span>
        </div>
      )}
      <div className="modal-actions">
        {role === 'CLIENTE' && canCancel && (
          <button
            className="button danger-outline"
            onClick={() => onUpdate({ status: 'Cancelado' })}
          >
            Cancelar pedido
          </button>
        )}
        {role === 'CLIENTE' && canCancel && (
          <button className="button outline" onClick={onEdit}>
            Modificar
          </button>
        )}
        {agent && order.status === 'Em análise' && (
          <>
            <button
              className="button danger-outline"
              onClick={() => onUpdate({ status: 'Reprovado' })}
            >
              Reprovar
            </button>
            <button className="button outline" onClick={() => onUpdate({ status: 'Aprovado' })}>
              <Check size={15} /> Aprovar pedido
            </button>
          </>
        )}
        {role === 'BANCO' && order.status === 'Aprovado' && (
          <button
            className="button primary"
            onClick={() => onUpdate({ status: 'Concluído', contract: true })}
          >
            <FileCheck2 size={15} /> Conceder crédito e executar
          </button>
        )}
        {!agent && ['Aprovado', 'Concluído'].includes(order.status) && (
          <button className="button primary" onClick={() => onViewContract(order)}>
            <FileCheck2 size={15} /> Ver contrato
          </button>
        )}
      </div>
    </Modal>
  )
}
function EditModal({ order, onClose, onSubmit }) {
  return (
    <Modal onClose={onClose}>
      <div className="modal-eyebrow">ATUALIZAR SOLICITAÇÃO</div>
      <h2>Modificar pedido</h2>
      <p className="modal-subtitle">Edite as informações do pedido {order?.id}.</p>
      <form
        className="modal-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({
            status: 'Em análise',
            details: { note: new FormData(e.currentTarget).get('note') },
          })
        }}
      >
        <label>
          Observação para a equipe
          <textarea
            name="note"
            rows="4"
            defaultValue={order?.details?.note || ''}
            placeholder="Conte algo importante sobre a sua solicitação..."
          />
        </label>
        <button className="button primary full-button">
          Salvar alterações <Check size={15} />
        </button>
      </form>
    </Modal>
  )
}
function AccountModal({ user, onClose, onLogout }) {
  return (
    <Modal onClose={onClose}>
      <div className="modal-eyebrow">SEU PERFIL</div>
      <div className="account-profile">
        <div className="avatar large">{initials(user.name)}</div>
        <div>
          <h2>{user.name}</h2>
          <span>{user.email}</span>
        </div>
      </div>
      <div className="account-detail">
        <span>Tipo de conta</span>
        <b>{roleLabel(user.role)}</b>
      </div>
      <div className="account-detail">
        <span>Situação</span>
        <b className="verified">
          <ShieldCheck size={14} /> Ativa
        </b>
      </div>
      <button className="button outline full-button" onClick={onLogout}>
        <LogOut size={15} /> Sair da conta
      </button>
    </Modal>
  )
}
