import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import Typography from '@material-ui/core/Typography';
import contracts from './contracts'

// const renderResolvers = (hydroId, resolvers, resolverContracts, updateState) => {
//   for (let i = 0; i < resolvers.length; i++) {
//     if (Object.keys(Resolvers.default).includes(resolvers[i])) {
//       let Resolver = Resolvers.default[resolvers[i]]
//       ReactDOM.render(
//         <ModalLink resolver={resolvers[i]}>
//           <Resolver hydroId={hydroId} resolverContract={resolverContracts[i]} updateState={updateState} />
//         </ModalLink>,
//         document.getElementById(resolvers[i])
//       );
//     }
//   }
// }

const linkify = function (type, data, display) {
  display = display === undefined ? data : display
  return <a href={this.props.w3w.etherscanFormat(type, data)} target="_blank">{display}</a>
}


class App extends Component {
  constructor(props) {
    super(props);

    this.linkify = linkify.bind(this)
  }


  render() {
    let networkName = this.props.w3w.getNetworkName()
    let snowflakeLink = this.linkify('address', contracts[networkName]['snowflake'].address, networkName)

    return (
      <div>
        <Typography variant="display3" gutterBottom align='center'>
          Snowflake Dashboard ({snowflakeLink})
        </Typography>
        <p>{this.props.w3w.account}</p>
      </div>
    );
  }
}

export default withWeb3(App);
