from sympy import symbols, sympify, lambdify
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application
import numpy as np
from typing import List, Dict, Any


def get_variable_names(data: List[Dict[str, Any]]) -> List[str]:
    if not data:
        return []
    return list(data[0].keys())


def parse_and_evaluate(expression: str, variable_values: Dict[str, float]) -> float:
    sym_vars = {name: symbols(name) for name in variable_values.keys()}
    transformations = standard_transformations + (implicit_multiplication_application,)
    expr = parse_expr(expression, local_dict=sym_vars, transformations=transformations)
    result = float(expr.subs(variable_values))
    return result


def run_simulation(model_expression: str, data: List[Dict[str, Any]]) -> List[float]:
    if not data:
        return []
    
    var_names = get_variable_names(data)
    sym_vars = {name: symbols(name) for name in var_names}
    
    transformations = standard_transformations + (implicit_multiplication_application,)
    expr = parse_expr(model_expression, local_dict=sym_vars, transformations=transformations)
    
    f = lambdify(list(sym_vars.values()), expr, modules='numpy')
    
    predictions = []
    for row in data:
        values = [float(row[name]) for name in var_names]
        result = f(*values)
        predictions.append(float(result))
    
    return predictions
