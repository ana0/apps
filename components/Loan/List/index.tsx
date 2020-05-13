import * as React from 'react';
import{ bnToHex, baseToDisplay, feeToInterestRate, Loan } from 'tinlake';
import { Box, DataTable, Anchor, Text } from 'grommet';
import { PoolLink } from '../../../components/PoolLink';
import NumberDisplay from '../../../components/NumberDisplay';
import Badge from '../../../components/Badge';
import { DisplayField } from '@centrifuge/axis-display-field';
import { getNFTLink, hexToInt } from '../../../utils/etherscanLinkGenerator';

interface Props {
  loans: Loan[];
  userAddress: string;
  proxies: string[];
}

class LoanList extends React.Component<Props> {
  render() {
    const { loans, proxies } =  this.props;
    return <Box margin={{ bottom: 'xlarge' }}>
      <DataTable style={{ tableLayout: 'auto' }} data={loans} sortable columns={[
        { header: <HeaderCell text={'Loan ID'}></HeaderCell>, property: 'loanId', align: 'end' },
        {
          header: 'NFT ID', property: 'tokenId', align: 'end',
          render: (l: Loan) =>
            <Box style={{ maxWidth: '150px' }}>
              <DisplayField
                as={'span'}
                value={hexToInt(bnToHex(l.tokenId).toString())}
                link={{
                  href: getNFTLink(hexToInt(bnToHex(l.tokenId).toString()), l.registry),
                  target: '_blank'
                }}
              />
            </Box>
        },
        {
          header: 'LoanOwner', property: 'loanOwner', align: 'end',
          render: (l: Loan) => <div>
            <Box style={{ maxWidth: '150px' }}>
              <DisplayField
                copy={true}
                as={'span'}
                value={l.ownerOf}
              />
            </Box>

          </div>
        },
        {
          header: '', property: '', align: 'end',
          render: (l: Loan) => <div>
            {proxies.includes(l.ownerOf.toString()) && <Badge text={'Me'} />}
          </div>
        },
        {
          header: 'Debt (DAI)', property: 'debt', align: 'end',
          render: (l: Loan) =>
            <NumberDisplay suffix="" precision={4}
              value={baseToDisplay(l.debt, 18)} />
        },
        {
          header: 'Max borrow amount (DAI)', property: 'principal', align: 'end',
          render: (l: Loan) =>
            <NumberDisplay suffix="" precision={4}
              value={baseToDisplay(l.principal, 18)} />
        },
        {
          header: <HeaderCell text={'Interest rate'}></HeaderCell>, property: 'fee', align: 'end',
          render: (l: Loan) => l.status === 'Repaid' ? '-' :
            <NumberDisplay suffix="%" value={feeToInterestRate(l.interestRate)} />
        },
        {
          header: 'Loan Status', property: 'status', align: 'end',
          render: (l: Loan) => l.status
        },
        {
          header: 'Actions', property: 'id', align: 'end', sortable: false,
          render: (l: Loan) => {
            return <PoolLink href={{ pathname: '/loans/loan', query: { loanId: l.loanId } }}>
              <Anchor>View</Anchor></PoolLink>;
          }
        }
      ]} />
    </Box>;
  }
}
const HeaderCell = (props: { text: string }) => (
  <Box pad={{ left: 'small' }}><Text>{props.text}</Text></Box>
);

export default LoanList;
