import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.error.main,
    marginTop: (props: any) => props.marginTop,
    marginBottom: (props: any) => props.marginBottom
  }
}))

interface Props {
  error: string
  context?: string
  marginTop?: number
  marginBottom?: number
}

export const ErrorMessage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles(props)
  const message = props.context ? `Error occurred (${props.context}).` : 'Error occurred.'

  return <div className={classes.root}>{message}</div>
}
