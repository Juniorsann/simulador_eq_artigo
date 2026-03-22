import React from 'react'
import { Box, Button, Alert, CircularProgress, Typography, Paper, Stack } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

export default function SimulationPanel({ expression, data, onSimulate, loading, error, predictions }) {
  const canSimulate = expression && expression.trim() && data && data.length > 0

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="subtitle2">Modelo:</Typography>
          <Typography variant="body2" fontFamily="monospace" color="primary.main" sx={{ maxWidth: 500, wordBreak: 'break-all' }}>
            Y = {expression || '(nenhum modelo definido)'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Dados:</Typography>
          <Typography variant="body2">{data ? data.length : 0} linha(s)</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
          onClick={onSimulate}
          disabled={!canSimulate || loading}
          size="large"
        >
          {loading ? 'Simulando...' : 'Simular'}
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      {predictions && predictions.length > 0 && !error && (
        <Alert severity="success" sx={{ mt: 1 }}>
          Simulação concluída! {predictions.length} predições calculadas.
        </Alert>
      )}
    </Paper>
  )
}
