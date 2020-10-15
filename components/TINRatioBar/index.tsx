import * as React from 'react'

import { RatioBar } from '@centrifuge/axis-ratio-bar'

interface Props {
  current?: number
  min?: number
  max?: number
}

export const TINRatioBar: React.FC<Props> = (props: Props) => {
  const segments =
    props.current && props.min && props.max
      ? [
          {
            width: 100 - props.max * 100,
            backgroundColor: '#0828BE',
            separator: {
              text: `Max: ${Math.round(props.max * 100)}%`,
              color: '#000',
              position: 'bottom',
            },
          },
          {
            width: 100 - props.current * 100 - (100 - props.max * 100),
            backgroundColor: '#0828BE',
            separator: {
              text: `Current: ${Math.round(props.current * 100)}%`,
              color: '#0828BE',
              position: 'top',
            },
          },
          {
            width: 100 - props.min * 100 - (100 - props.current * 100) - (100 - props.max * 100),
            backgroundColor: '#D8D8D8',
            separator: {
              text: `Min: ${Math.round(props.min * 100)}%`,
              color: '#000',
              position: 'bottom',
            },
          },
          {
            width: props.min * 100,
            backgroundColor: '#D8D8D8',
          },
        ]
      : [
          {
            width: 100,
            backgroundColor: '#D8D8D8',
          },
        ]

  return segments ? <RatioBar labels={{ left: 'DROP', right: 'TIN' }} segments={segments} /> : null
}
