import React, { useMemo } from 'react'
import { Box, Typography, Button, Grid, Paper, Stack } from '@mui/material'
import Plot from 'react-plotly.js'
import DownloadIcon from '@mui/icons-material/Download'

function downloadCSV(data, predictions) {
  if (!data || !predictions) return
  const headers = [...Object.keys(data[0]), 'Y_pred']
  const rows = data.map((row, i) => [...Object.values(row), predictions[i]])
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resultados_simulacao.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Charts({ data, predictions }) {
  if (!predictions || predictions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          Execute a simulação para ver os gráficos
        </Typography>
      </Box>
    )
  }

  const variables = data && data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'id') : []

  const scatterPlots = variables.map(varName => {
    const xValues = data.map(row => parseFloat(row[varName]) || 0)
    return (
      <Grid item xs={12} md={6} key={varName}>
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Plot
            data={[{
              x: xValues,
              y: predictions,
              mode: 'markers',
              type: 'scatter',
              marker: { color: '#1976d2', size: 8 },
              name: 'Y pred'
            }]}
            layout={{
              title: `Y vs ${varName}`,
              xaxis: { title: varName },
              yaxis: { title: 'Y predito' },
              margin: { t: 40, r: 20, b: 50, l: 60 },
              height: 300,
            }}
            style={{ width: '100%' }}
            config={{ responsive: true }}
          />
        </Paper>
      </Grid>
    )
  })

  // 3D surface if we have at least x1 and x2
  let surface3D = null
  if (variables.includes('x1') && variables.includes('x2')) {
    const x1Vals = data.map(r => parseFloat(r['x1']) || 0)
    const x2Vals = data.map(r => parseFloat(r['x2']) || 0)
    surface3D = (
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Plot
            data={[{
              x: x1Vals,
              y: x2Vals,
              z: predictions,
              mode: 'markers',
              type: 'scatter3d',
              marker: { color: predictions, colorscale: 'Viridis', size: 6, showscale: true },
              name: 'Y pred'
            }]}
            layout={{
              title: 'Superfície de Resposta 3D (Y vs x1, x2)',
              scene: {
                xaxis: { title: 'x1' },
                yaxis: { title: 'x2' },
                zaxis: { title: 'Y' }
              },
              margin: { t: 50, r: 20, b: 20, l: 20 },
              height: 450,
            }}
            style={{ width: '100%' }}
            config={{ responsive: true }}
          />
        </Paper>
      </Grid>
    )
  }

  // Boxplot
  const boxplot = (
    <Grid item xs={12} md={6}>
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Plot
          data={[{
            y: predictions,
            type: 'box',
            name: 'Y predito',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
            marker: { color: '#1976d2' },
          }]}
          layout={{
            title: 'Distribuição dos Valores Preditos',
            yaxis: { title: 'Y' },
            margin: { t: 40, r: 20, b: 40, l: 60 },
            height: 300,
          }}
          style={{ width: '100%' }}
          config={{ responsive: true }}
        />
      </Paper>
    </Grid>
  )

  // Stats
  const mean = predictions.reduce((a, b) => a + b, 0) / predictions.length
  const min = Math.min(...predictions)
  const max = Math.max(...predictions)
  const std = Math.sqrt(predictions.reduce((a, b) => a + (b - mean) ** 2, 0) / predictions.length)

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Resultados da Simulação</Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => downloadCSV(data, predictions)}
          size="small"
        >
          Exportar CSV
        </Button>
      </Stack>

      <Grid container spacing={1} mb={2}>
        {[
          { label: 'N amostras', value: predictions.length },
          { label: 'Média', value: mean.toFixed(4) },
          { label: 'Mín', value: min.toFixed(4) },
          { label: 'Máx', value: max.toFixed(4) },
          { label: 'Desvio Padrão', value: std.toFixed(4) },
        ].map(stat => (
          <Grid item xs={6} sm={4} md={2} key={stat.label}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {scatterPlots}
        {boxplot}
        {surface3D}
      </Grid>
    </Box>
  )
}
