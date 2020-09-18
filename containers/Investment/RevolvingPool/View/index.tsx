import * as React from 'react'
import { Box, Heading } from 'grommet'
import { Pool } from '../../../../config'
import { ITinlake as ITinlakeV3 } from '@centrifuge/tinlake-js-v3'
import { connect } from 'react-redux'

import { ExplainerCard } from './styles'
import TrancheOverview from './TrancheOverview'
import EpochOverview from './EpochOverview'
import AdminActions from './AdminActions'
import { useInterval } from '../../../../utils/hooks'
import { AuthState } from '../../../../ducks/auth'

interface Props {
  activePool: Pool
  tinlake: ITinlakeV3
  auth: AuthState
}

export type EpochData = {
  id: number
  state: 'open' | 'can-be-closed' | 'in-challenge-period' | 'challenge-period-ended'
}

const InvestmentsView: React.FC<Props> = (props: Props) => {
  const isAdmin = props.auth.permissions?.canSetMinimumJuniorRatio

  const [epochData, setEpochData] = React.useState<EpochData | undefined>(undefined)

  const updateEpochData = async () => {
    setEpochData({
      id: await props.tinlake.getCurrentEpochId(),
      state: await props.tinlake.getCurrentEpochState(),
    })
  }

  useInterval(() => {
    updateEpochData()
  }, 60000)

  React.useEffect(() => {
    updateEpochData()
  }, [props.tinlake.signer])

  return (
    <Box margin={{ top: 'medium' }}>
      {/* <Heading level="4">Pool Overview {props.activePool?.name}</Heading>
      <ExplainerCard margin={{ bottom: 'medium' }}>
        Investors can invest into this Tinlake pool through two tokens that are backed by collateral locked by the Asset
        Originator: TIN and DROP. Both tokens represent the liquidity deposited into Tinlake and accrue interest over
        time. TIN, known as the “risk token,” takes the risk of defaults first but also receives higher returns. DROP,
        known as the “yield token,” is protected against defaults by the TIN token and receives stable (but usually
        lower) returns at the DROP rate.
      </ExplainerCard>

      <PoolOverview pool={props.activePool} /> */}

      <Heading level="4">Invest/Redeem in {props.activePool?.name}</Heading>
      <ExplainerCard margin={{ bottom: 'medium' }}>
        Please place your DROP and TIN invstments and redemptions below. Tinlake pool investments and redemptions are
        locked in throughout the current “Epoch” and executed at the end of the Epoch based on available capital
        considering the pools risk metrics. You can cancel your order at any time until the end of the Epoch. Please
        find more detailed information about Epochs, the Epoch matching mechanism and how to invest and redeem into
        Tinlake here…
      </ExplainerCard>

      <Box direction="row" justify="start" gap="medium">
        <TrancheOverview epochData={epochData} pool={props.activePool} tinlake={props.tinlake} tranche="junior" />
        <TrancheOverview epochData={epochData} pool={props.activePool} tinlake={props.tinlake} tranche="senior" />
      </Box>

      {isAdmin && (
        <>
          <Heading level="4">Admin actions for {props.activePool?.name}</Heading>
          <AdminActions pool={props.activePool} tinlake={props.tinlake} />
          {epochData && <EpochOverview epochData={epochData} tinlake={props.tinlake} />}
        </>
      )}
    </Box>
  )
}

export default connect((state) => state)(InvestmentsView)
