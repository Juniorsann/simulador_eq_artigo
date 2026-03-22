import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Stack, TextField, Select, MenuItem,
  FormControl, InputLabel, IconButton, Paper, Chip, Divider, Switch, FormControlLabel
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

const VARIABLES = ['x1', 'x2', 'x3', 'x4', 'x5']
const EXPONENTS = [1, 2, 3]

function termToString(term) {
  if (term.isConstant) {
    return `${term.coefficient}`
  }
  let s = `${term.coefficient}*${term.var1}`
  if (term.exp1 > 1) s += `**${term.exp1}`
  if (term.var2 && term.var2 !== 'none') {
    s += `*${term.var2}`
    if (term.exp2 > 1) s += `**${term.exp2}`
  }
  return s
}

function buildExpression(terms) {
  if (terms.length === 0) return ''
  return terms.map(termToString).join(' + ').replace(/\+ -/g, '- ')
}

export default function ModelBuilder({ onExpressionChange }) {
  const [terms, setTerms] = useState([
    { id: 1, isConstant: false, coefficient: 23.38, var1: 'x1', exp1: 1, var2: 'none', exp2: 1 }
  ])
  const [nextId, setNextId] = useState(2)

  useEffect(() => {
    const expr = buildExpression(terms)
    onExpressionChange(expr)
  }, [terms])

  const addTerm = () => {
    setTerms(prev => [...prev, { id: nextId, isConstant: false, coefficient: 1, var1: 'x1', exp1: 1, var2: 'none', exp2: 1 }])
    setNextId(n => n + 1)
  }

  const addConstant = () => {
    setTerms(prev => [...prev, { id: nextId, isConstant: true, coefficient: 0 }])
    setNextId(n => n + 1)
  }

  const removeTerm = (id) => {
    setTerms(prev => prev.filter(t => t.id !== id))
  }

  const updateTerm = (id, field, value) => {
    setTerms(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const expression = buildExpression(terms)

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Construtor de Modelo Matemático</Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom>Equação Gerada:</Typography>
        <Typography variant="body1" fontFamily="monospace" color="primary.main" sx={{ wordBreak: 'break-all' }}>
          Y = {expression || '(adicione termos)'}
        </Typography>
      </Paper>

      <Stack spacing={2}>
        {terms.map((term, idx) => (
          <Paper key={term.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
                {idx + 1}.
              </Typography>
              
              <TextField
                label="Coeficiente"
                type="number"
                value={term.coefficient}
                onChange={e => updateTerm(term.id, 'coefficient', parseFloat(e.target.value) || 0)}
                size="small"
                sx={{ width: 120 }}
              />

              {!term.isConstant && (
                <>
                  <Typography>×</Typography>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel>Var 1</InputLabel>
                    <Select value={term.var1} label="Var 1" onChange={e => updateTerm(term.id, 'var1', e.target.value)}>
                      {VARIABLES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 70 }}>
                    <InputLabel>Exp 1</InputLabel>
                    <Select value={term.exp1} label="Exp 1" onChange={e => updateTerm(term.id, 'exp1', e.target.value)}>
                      {EXPONENTS.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel>Var 2</InputLabel>
                    <Select value={term.var2 || 'none'} label="Var 2" onChange={e => updateTerm(term.id, 'var2', e.target.value)}>
                      <MenuItem value="none">—</MenuItem>
                      {VARIABLES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {term.var2 && term.var2 !== 'none' && (
                    <FormControl size="small" sx={{ minWidth: 70 }}>
                      <InputLabel>Exp 2</InputLabel>
                      <Select value={term.exp2 || 1} label="Exp 2" onChange={e => updateTerm(term.id, 'exp2', e.target.value)}>
                        {EXPONENTS.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}

              <Chip label={termToString(term)} size="small" color="primary" variant="outlined" sx={{ fontFamily: 'monospace' }} />

              <IconButton size="small" color="error" onClick={() => removeTerm(term.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} mt={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={addTerm} size="small">
          Adicionar Termo
        </Button>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addConstant} size="small">
          Adicionar Constante
        </Button>
      </Stack>

      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>Ou edite a expressão diretamente:</Typography>
        <TextField
          fullWidth
          value={expression}
          onChange={e => {
            onExpressionChange(e.target.value)
          }}
          placeholder="ex: 23.38 + 9.59*x1 + 1.56*x1**2"
          size="small"
          helperText="Edite diretamente ou use o construtor acima. Use ** para potências."
        />
      </Box>
    </Box>
  )
}
