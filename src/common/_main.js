const snowflakeDashboard = ($) => {
  // helper function to make etherscan formatting into link tags
  var blockAccountChangeRefresh = false

  const linkify = (type, data, display) => {
    display = display === undefined ? data : display
    return `<a href="${window.w3w.etherscanFormat(type, data)}" target="_blank">${display}</a>`
  }

  const hydroContracts = window.hydroContracts
  const getContract = (contractName) => {
    let contract = hydroContracts[window.w3w.getNetworkName()][contractName]
    return window.w3w.getContract(contract.ABI, contract.address)
  }

  // sign up for hydroId
  const getHydroId = () => {
    $('#getHydroId div').html(`<p>Preparing Transaction...</p>`)

    let hydroId = $('#getHydroId input').val()
    let method = getContract('clientRaindrop').methods.signUpUser(hydroId)
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        $('#getHydroId div').html(`<p>${message}</p>`)
      },
      transactionHash: (transactionHash) => {
        $('#getHydroId div').html(`<p>Pending: ${linkify('transaction', transactionHash)}`)
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          updateState(window.w3w.getAccount())
        }
      }
    })
  }

  // mint Snowflake
  const mintSnowflake = () => {
    $('#mintSnowflake div').html('<p>Preparing Transaction...</p>')

    // make the transaction
    let method = getContract('snowflake').methods.mintIdentityToken()
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        $('#mintSnowflake div').html(`<p>${message}</p>`)
      },
      transactionHash: (transactionHash) => {
        $('#mintSnowflake div').html(`<p>Pending: ${linkify('transaction', transactionHash)}`)
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          updateState(window.w3w.getAccount())
        }
      }
    })
  }

  // deposit hydro
  const depositHydro = () => {
    $('#deposit div').html('<p>Preparing Transaction...</p>')

    let amount = window.w3w.fromDecimal($('#deposit input').val(), 18)

    let method = getContract('token').methods.approveAndCall(
      hydroContracts[window.w3w.getNetworkName()]['snowflake'].address, amount, '0x00'
    )
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        $('#deposit div').html(`<p>${message}</p>`)
      },
      transactionHash: (transactionHash) => {
        $('#deposit div').html(`<p>Pending: ${linkify('transaction', transactionHash)}`)
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          updateState(window.w3w.getAccount())
        }
      }
    })
  }

  // add resolver
  const addResolver = () => {
    let address = $('#addResolver input:nth-child(1)').val()
    let allowance = $('#addResolver input:nth-child(2)').val()
    allowance = allowance === undefined ? '0' : window.w3w.fromDecimal(allowance, 18)

    let method = getContract('snowflake').methods.addResolvers([address], [allowance])
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        $('#addResolver div').html(`<p>${message}</p>`)
      },
      transactionHash: (transactionHash) => {
        $('#addResolver div').html(`<p>Pending: ${linkify('transaction', transactionHash)}`)
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          updateState(window.w3w.getAccount())
        }
      }
    })
  }

  const updateState = async (account) => {
    // check for hydro ID
    let hasHydroId = await getContract('clientRaindrop').methods.getUserByAddress(account).call()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    if (!hasHydroId) {
      displayNoHydroId(account)
      return
    }

    // check for Snowflake
    let snowflakeContract = getContract('snowflake')
    let hydroId = await snowflakeContract.methods.getHydroId(account).call()
      .catch(() => {
        return null
      })
    if (hydroId === null) {
      displayNoSnowflake()
      return
    }
    $('#hydroId').html(hydroId).parent().show()

    let getDetails = () => {
      return snowflakeContract.methods.getDetails(hydroId).call()
        .then(async details => {
          let getResolverDetails = () => {
            return Promise.all(details.resolvers.map(async resolver => {
              var resolverEntry = hydroContracts[window.w3w.getNetworkName()].resolvers[resolver]
              if (resolverEntry !== undefined) {
                let resolverContract = window.w3w.getContract(resolverEntry.ABI, resolverEntry.address)
                var name = await resolverContract.methods.snowflakeName().call()
                var description = await resolverContract.methods.snowflakeDescription().call()
              }
              return {
                name: name,
                description: description
              }
            }))
          }

          let getResolverAllowances = () => {
            return Promise.all(details.resolvers.map(resolver => {
              return snowflakeContract.methods.getResolverAllowance(hydroId, resolver).call()
                .then(allowance => {
                  return window.w3w.toDecimal(allowance, 18)
                })
            }))
          }

          return Promise.all([getResolverDetails(), getResolverAllowances()])
            .then(([resolverDetails, resolverAllowances]) => {
              return {
                owner: details.owner,
                ownedAddresses: details.ownedAddresses,
                resolvers: details.resolvers,
                resolverAllowances: resolverAllowances,
                name: resolverDetails.map(details => { return details.name }),
                description: resolverDetails.map(details => { return details.description }),
              }
            })
        })
    }

    let getHydroBalance = () => {
      return window.w3w.getERC20Balance(hydroContracts[window.w3w.getNetworkName()]['token'].address, account)
        .then(balance => {
          return Number(balance).toLocaleString(undefined, { maximumFractionDigits: 3 })
        })
    }

    let getSnowflakeBalance = () => {
      return snowflakeContract.methods.snowflakeBalance(hydroId).call()
        .then(balance => {
          // TODO make this less hacky
          var standardized = window.w3w.getWeb3js().utils.fromWei(balance, 'ether')
          standardized = Number(standardized).toLocaleString(undefined, { maximumFractionDigits: 3 })
          return standardized
        })
    }

    Promise.all([getHydroBalance(), getSnowflakeBalance(), getDetails()])
      .then(([hydroBalance, snowflakeBalance, details]) => {
        displayHasSnowflake(hydroId, account, hydroBalance, snowflakeBalance, details)
      })
      .catch(error => {
        displayError('Error Fetching Token Balances or Resolver Details', error.toString())
      })
  }

  const show = (id) => {
    $('#errorSplash, #noHydroId, #noSnowflake, #hasSnowflake').hide()
    $(id).show()
  }

  const displayError = (title, message) => {
    message = message === undefined ? '' : message
    $('#errorSplash h2').html(title)
    $('#errorSplash p').html(message)
    show('#errorSplash')
  }

  const displayNoHydroId = (account) => {
    $('#getHydroId button').off()
    $('#getHydroId button').on('click', getHydroId)
    $('#getHydroId div').html('')
    $('#getHydroId input').val('')

    show('#noHydroId')
  }

  const displayNoSnowflake = () => {
    $('#mintSnowflake button').off()
    $('#mintSnowflake button').on('click', mintSnowflake)
    $('#mintSnowflake div').html('')
    $('#mintSnowflake input').val('')

    show('#noSnowflake')
  }

  const displayHasSnowflake = (hydroId, account, hydroBalance, snowflakeBalance, details) => {
    $('#hasSnowflake #hydroBalance').html(hydroBalance)
    $('#hasSnowflake #snowflakeBalance').html(snowflakeBalance)

    // populate owned addresses
    $('#hasSnowflake ul').html('')
    details.ownedAddresses.map(address => {
      $('#hasSnowflake ul').append(`<li>${linkify('address', address)}</li>`)
    })

    // populate resolvers
    $('#hasSnowflake table').DataTable().destroy()
    $('#hasSnowflake table tbody').html('')
    for (let i = 0; i < details.resolvers.length; i++) {
      let row =
        `<tr>` +
        `<td>${details.name[i]}</td>` +
        `<td>${details.resolverAllowances[i]}</td>` +
        `<td>${details.description[i]}</td>` +
        `<td>${linkify('address', details.resolvers[i])}</td>` +
        `<td id="${details.resolvers[i]}"></td>` +
        `</tr>`
      $('#hasSnowflake table tbody').append(row)
    }
    var resolverContracts = details.resolvers.map(resolver => {
      let resolverEntry = hydroContracts[window.w3w.getNetworkName()].resolvers[resolver]
      return window.w3w.getContract(resolverEntry.ABI, resolverEntry.address)
    })
    window.renderResolvers(hydroId, details.resolvers, resolverContracts, updateState)

    $('#hasSnowflake table').DataTable({
      info: false,
      paging: false,
      searching: false,
      lengthChange: false
    })

    // set up tabs
    $('.tab').hide()
    $('#snowflakeTabs').find('button').addClass('button-outline')
    $('#tabs').find('button').each(function () {
      $(this).off()
      $(this).on('click', () => {
        $('.tab').hide()
        $('#snowflakeTabs').find('button').addClass('button-outline')
        $(this).removeClass('button-outline')
        $(`#${$(this).data('id')}`).show()
      })
    })

    // set up address claim tab
    $('#claimAddress div:nth-child(2)').children().hide()
    $('#claimAddress div:nth-child(1) button').off()
    $('#claimAddress div:nth-child(1) button').on('click', () => { initiateAddressClaim(hydroId) })
    $('#unclaimAddress input').val('')
    $('#unclaimAddress button').off()
    $('#unclaimAddress button').on('click', () => { unclaimAddress() })

    // set up deposit tab
    $('#deposit button').off()
    $('#deposit button').on('click', depositHydro)
    $('#deposit div').html('')
    $('#deposit input').val('')

    // set up
    $('#addResolver input').val('')
    $('#addResolver button').off()
    $('#addResolver button').on('click', addResolver)

    show('#hasSnowflake')
  }

  const initiateAddressClaim = (hydroId) => {
    let web3js = window.w3w.getWeb3js()

    // get a secret value
    var randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)
    let hashedSecret = web3js.utils.sha3(randomValues[0].toString())

    let address = $('#claimAddress div:nth-child(1) input').val()
    let claim = web3js.utils.soliditySha3(address, hashedSecret, hydroId)
    let details = {
      claim: claim,
      address: address,
      hydroId: hydroId,
      hashedSecret: hashedSecret
    }

    let method = getContract('snowflake').methods.initiateClaim(claim)
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        $('#claimAddress div:nth-child(1) form div').html(`<p>${message}</p>`)
      },
      transactionHash: (transactionHash) => {
        blockAccountChangeRefresh = true
        $('#claimAddress div:nth-child(1) form div').html(`<p>Pending: ${linkify('transaction', transactionHash)}`)
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          $('#claimAddress div:nth-child(1)').html('<p>Success!</p>')
          $('#claimAddress div:nth-child(2) #addressToClaim').html(linkify('address', address))
          $('#claimAddress div:nth-child(2) button').off()
          $('#claimAddress div:nth-child(2) button').on('click', () => { finalizeAddressClaim(details) })
          $('#claimAddress div:nth-child(2)').children().show()
        }
      }
    })
  }

  const unclaimAddress = () => {
    let address = $('#unclaimAddress input').val()
    if (address === undefined) {
      $('#unclaimAddress div').html(`<p>Please enter an address</p>`)
      return
    }

    let method = getContract('snowflake').methods.unclaim(address)
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        $('#unclaimAddress div').html(`<p>${message}</p>`)
      },
      transactionHash: (transactionHash) => {
        blockAccountChangeRefresh = true
        $('#unclaimAddress div').html(`<p>Pending: ${linkify('transaction', transactionHash)}`)
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          updateState(window.w3w.getAccount())
        }
      }
    })
  }

  const finalizeAddressClaim = (details) => {
    if (window.w3w.getAccount().toLowerCase() !== details.address.toLowerCase()) {
      $('#claimAddress div:nth-child(2) form div').html(`<p>Please transact from the address to be claimed.</p>`)
      return
    }

    let method = getContract('snowflake').methods.finalizeClaim(details.hashedSecret, details.hydroId)
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        $('#claimAddress div:nth-child(2) form div').html(`<p>${message}</p>`)
      },
      transactionHash: (transactionHash) => {
        $('#claimAddress div:nth-child(2) form div').html(`<p>Pending: ${linkify('transaction', transactionHash)}`)
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          blockAccountChangeRefresh = false
          updateState(window.w3w.getAccount())
        }
      }
    })
  }

  // web3-webpacked configuration
  const w3wConfig = {
    handlers: {
      noWeb3Handler: () => {
        displayError(
          'No Web3 Connection Detected', 'Your browser cannot connect to Ethereum. Please install MetaMask or Trust.'
        )
      },
      web3ErrorHandler: (error) => {
        console.error(error)

        if (error.name === window.w3w.networkErrorName) {
          displayError(
            'Unsupported Network', 'This dApp is currently only supported on Rinkeby. Please switch networks.'
          )
        } else {
          displayError('Web3 Error', error.toString())
        }
      },
      web3AccountChangeHandler: account => {
        if (account === null) {
          displayError('Locked Account', 'Please unlock your Ethereum account.')
          return
        }

        $('#addressLink').html(linkify('address', account))
        $('#hydroId').parent().hide()

        if (!blockAccountChangeRefresh) updateState(account)
      },
      web3NetworkChangeHandler: network => {
        let link = linkify(
          'address', hydroContracts[window.w3w.getNetworkName()]['snowflake'].address, window.w3w.getNetworkName()
        )
        $('#networkLink').html(`(${link})`)
      }
    },
    supportedNetworks: [4]
  }

  $(() => {
    displayError('Loading...')
  })

  $(window).on('load', () => {
    window.w3w.initializeWeb3(w3wConfig)
  })
}

snowflakeDashboard(window.jQuery)
