import React, { useState, useCallback } from 'react'
import {
  Container, Box, Typography, Tabs, Tab, AppBar, Toolbar, Paper, CssBaseline
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ScienceIcon from '@mui/icons-material/Science'
import ExperimentTable from './components/ExperimentTable'
import ModelBuilder from './components/ModelBuilder'
import Charts from './components/Charts'
import SimulationPanel from './components/SimulationPanel'
import { simulateData } from './api/simulation'

const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#00897B' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
})

function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 2 }}>
      {value === index && children}
    </Box>
  )
}

const DEFAULT_DATA = [
  { id: 1, x1: -1, x2: -1, x3: -1 },
  { id: 2, x1: 1, x2: -1, x3: -1 },
  { id: 3, x1: -1, x2: 1, x3: -1 },
  { id: 4, x1: 1, x2: 1, x3: -1 },
  { id: 5, x1: -1, x2: -1, x3: 1 },
  { id: 6, x1: 1, x2: -1, x3: 1 },
  { id: 7, x1: -1, x2: 1, x3: 1 },
  { id: 8, x1: 1, x2: 1, x3: 1 },
]

export default function App() {
  const [tab, setTab] = useState(0)
  const [data, setData] = useState(DEFAULT_DATA)
  const [expression, setExpression] = useState('23.38 + 9.59*x1 + 1.56*x1**2')
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSimulate = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const cleanData = data.map(({ id, ...rest }) => rest)
      const result = await simulateData(expression, cleanData)
      setPredictions(result.predictions)
      setTab(2)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Erro desconhecido'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [data, expression])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <ScienceIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Simulador de Equações - Análise de Processos
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <SimulationPanel
          expression={expression}
          data={data}
          onSimulate={handleSimulate}
          loading={loading}
          error={error}
          predictions={predictions}
        />

        <Paper variant="outlined">
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Dados Experimentais" />
            <Tab label="Modelo Matemático" />
            <Tab label={`Resultados${predictions ? ` (${predictions.length})` : ''}`} />
          </Tabs>

          <Box sx={{ p: 2 }}>
            <TabPanel value={tab} index={0}>
              <ExperimentTable data={data} onChange={setData} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <ModelBuilder onExpressionChange={setExpression} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <Charts data={data} predictions={predictions} />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}
