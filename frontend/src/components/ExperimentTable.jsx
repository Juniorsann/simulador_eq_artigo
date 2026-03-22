import React, { useState, useCallback } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Typography, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

const DEFAULT_VARIABLES = ['x1', 'x2', 'x3']

export default function ExperimentTable({ data, onChange }) {
  const [variables, setVariables] = useState(DEFAULT_VARIABLES)
  const [nextVarNum, setNextVarNum] = useState(4)

  const addRow = () => {
    const newRow = { id: Date.now() }
    variables.forEach(v => { newRow[v] = 0 })
    onChange([...data, newRow])
  }

  const removeLastRow = () => {
    if (data.length > 0) {
      onChange(data.slice(0, -1))
    }
  }

  const addVariable = () => {
    const newVar = `x${nextVarNum}`
    setNextVarNum(n => n + 1)
    setVariables(prev => [...prev, newVar])
    onChange(data.map(row => ({ ...row, [newVar]: 0 })))
  }

  const removeLastVariable = () => {
    if (variables.length > 1) {
      const varToRemove = variables[variables.length - 1]
      setVariables(prev => prev.slice(0, -1))
      onChange(data.map(row => {
        const r = { ...row }
        delete r[varToRemove]
        return r
      }))
    }
  }

  const processRowUpdate = useCallback((newRow) => {
    onChange(data.map(row => row.id === newRow.id ? newRow : row))
    return newRow
  }, [data, onChange])

  const columns = variables.map(varName => ({
    field: varName,
    headerName: varName.toUpperCase(),
    width: 120,
    editable: true,
    type: 'number',
  }))

  const rows = data.map((row, idx) => ({ ...row, id: row.id || idx }))

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Dados Experimentais</Typography>
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={1}>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addRow}>
          Adicionar Linha
        </Button>
        <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon />} onClick={removeLastRow} disabled={data.length === 0}>
          Remover Última Linha
        </Button>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addVariable}>
          Adicionar Variável
        </Button>
        <Button variant="outlined" size="small" color="warning" onClick={removeLastVariable} disabled={variables.length <= 1}>
          Remover Última Variável
        </Button>
      </Stack>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          editMode="cell"
          disableSelectionOnClick
          density="compact"
        />
      </Box>
      <Typography variant="caption" color="text.secondary" mt={1}>
        Clique numa célula para editar. {data.length} linha(s) | {variables.length} variável(is)
      </Typography>
    </Box>
  )
}
