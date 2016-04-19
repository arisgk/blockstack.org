'use strict'

import {Component, PropTypes} from 'react'
import {Link}        from 'react-router'
import DocumentTitle from 'react-document-title'
import request       from 'request'
import { Person }    from 'blockstack-profiles'

import Header        from '../components/Header'
import Footer        from '../components/Footer'

class ProfilePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      profile: null
    }
  }

  componentDidMount() {
    let domainName = null
    if (this.props.routeParams.hasOwnProperty('name')) {
      domainName = this.props.routeParams.name
      domainName = domainName.split('.')[0]
    }

    if (domainName) {
      request({
        url: `https://api.onename.com/v1/users/${domainName}`,
        withCredentials: false
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let profile = JSON.parse(body)[domainName].profile
          profile = Person.fromLegacyFormat(profile).toJSON()
          this.setState({
            profile: profile
          })
        } else {
          console.log(error)
        }
      })
    }
  }

  render() {
    const person = new Person(this.state.profile || {})

    return (
      <DocumentTitle title={`Blockstack - ${person.name()}'s Profile`}>
        <div>
          <div className="container-fluid col-centered navbar-fixed-top bg-primary">
            <Header />
          </div>
          <section className="feature-action col-centered">
            <div className="container-fluid proid-wrap p-t-4">
              { person !== null && person !== undefined ?
              <div className="col-sm-9">
                <div className="container">
                  <div className="profile-container col-sm-6 center-block">
                    <div className="profile-wrap">
                      <div className="idcard-block">
                        <div className="id-flex">
                          <img className="img-idcard" src={person.avatarUrl()} />
                          <div className="overlay"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="idcard-wrap">
                        <h1 className="idcard-name">{person.name()}</h1>
                        <div className="idcard-body inverse">
                          {person.toJSON().description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div></div>
              }
            </div>
            <Footer />
          </section>
        </div>
      </DocumentTitle>
    )
  }
}

export default ProfilePage
