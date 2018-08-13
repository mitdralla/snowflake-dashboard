import React from 'react';
import ReactDOM from 'react-dom';
import ModalLink from './ModalLink';
import * as Resolvers from './resolverComponents';

const renderResolvers = (hydroId, resolvers, resolverContracts, updateState) => {
  for (let i = 0; i < resolvers.length; i++) {
    if (Object.keys(Resolvers.default).includes(resolvers[i])) {
      let Resolver = Resolvers.default[resolvers[i]]
      ReactDOM.render(
        <ModalLink resolver={resolvers[i]}>
          <Resolver hydroId={hydroId} resolverContract={resolverContracts[i]} updateState={updateState} />
        </ModalLink>,
        document.getElementById(resolvers[i])
      );
    }
  }
}

window.renderResolvers = renderResolvers
