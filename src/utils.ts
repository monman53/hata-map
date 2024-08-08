import { fitView, vec } from './math'
import { displayParameter, displayProps, parameter, parameterProps } from './parameters'

export const humanReadable = (x: number) => {
  return x.toPrecision(4)
}

export const resetParameter = (category: any) => {
  for (const prop of category.props) {
    parameter.value[prop.name as keyof typeof parameter.value] = prop.default.copy()
  }
}

export const resetAllParameter = () => {
  for (const category of displayProps.value) {
    for (const prop of category.props) {
      displayParameter.value[prop.name as keyof typeof displayParameter.value] = prop.default
    }
  }
  for (const category of parameterProps.value) {
    for (const prop of category.props) {
      parameter.value[prop.name as keyof typeof parameter.value] = prop.default.copy()
    }
  }

  fitView()
}

export const randomParameter = () => {
  for (const category of parameterProps.value) {
    for (const prop of category.props) {
      parameter.value[prop.name as keyof typeof parameter.value] = vec(
        prop.min + Math.random() * (prop.max - prop.min),
        prop.min + Math.random() * (prop.max - prop.min)
      )
    }
  }
}
