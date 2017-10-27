import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Imports
// import { OK, ACCEPTED } from 'constants/statusTypes';
import { accept } from 'actions/TermsActions';
import { areTermsAccepted, isRegistered } from 'reducers/AppReducer';
import { isError, isException } from 'reducers/ErrorReducer';

// UI Styling and other stuff like that
import styles from './styles.css';

class TermsPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.object,
    isError: PropTypes.bool,
    isException: PropTypes.bool,
    isRegistered: PropTypes.bool,
    termsAccepted: PropTypes.bool,
  };
  static defaultProps = {
    error: undefined,
    isError: false,
    isException: false,
    isRegistered: false,
    termsAccepted: false,
  };

  constructor(props) {
    super(props);
    this.handleAccept = this.handleAccept.bind(this);
  }

  handleAccept() {
    this.props.dispatch(accept());
  }

  render() {
    const {
      error,
      isRegistered,
      termsAccepted,
      isError,
      isException,
    } = this.props;

    if (isException) {
      console.warn('EXCEPTION DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    if (isError) {
      console.warn('ERROR DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    // if user has not termsAccepted
    if (!isRegistered) {
      console.warn('USER NOT BEEN REGISTERED - REDIRECT TO DASHBOARD'); // eslint-disable-line no-console
      console.log(this.props); // eslint-disable-line no-console
      return <Redirect to="/" push />;
    }

    if (termsAccepted) {
      console.warn('TERMS ALREADY ACCEPTED - REDIRECT TO DASHBOARD'); // eslint-disable-line no-console
      console.log(this.props); // eslint-disable-line no-console
      return <Redirect to="/" push />;
    }

    return (
      <div className={styles.root}>
        <div className={styles.form}>
          <h1 className={styles.heading}><FormattedMessage id="termsAndConditions" /></h1>
          <div className={styles.terms}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sagittis nunc est, id tincidunt
              acus laoreet accumsan. Aliquam quis massa molestie, suscipit arcu vitae, aliquam lacus. Aliquam
              justo justo, mollis in lectus id, porta auctor nisl. Morbi aliquam lorem leo, vitae consequat dui
              condimentum et. Phasellus et tristique urna, ac facilisis urna. Duis in dolor varius erat pulvinar
              vestibulum. Aliquam efficitur tellus nec tortor tempor elementum. Quisque sit amet nibh metus.
              Ut luctus, urna in finibus convallis, purus lectus rutrum quam, sit amet tempus elit diam in felis.
              Proin finibus rhoncus massa, sed faucibus dui ornare vitae.
            </p>

            <p>
              In lobortis lorem ac sapien facilisis, eu pretium arcu scelerisque. Sed risus erat, pretium eu
              egestas at, pulvinar id elit. In elementum quam vitae libero auctor, a elementum ipsum ornare.
              Aenean luctus, ipsum vel cursus eleifend, urna massa pharetra enim, nec hendrerit dolor lorem at mi.
              ed et dolor turpis. In blandit sem felis, nec rhoncus justo maximus ac. Vivamus venenatis consequat
              sem, sit amet consequat tortor condimentum et. Aliquam ultricies magna at est pharetra interdum.
              Morbi ut bibendum mauris. Vivamus sodales tempor aliquam. Praesent eu arcu porttitor, ultrices
              urna quis, tempor justo. Nullam venenatis facilisis ipsum a pellentesque. Donec facilisis efficitur
              lacus, nec posuere purus lobortis quis. Aenean fermentum nisi elit, ac rutrum arcu ornare sed.
              Aliquam erat felis, commodo et diam id, fermentum scelerisque sem. Donec ac egestas leo, vehicula
              porttitor lectus.
            </p>

            <p>
              Vestibulum non dui accumsan, lacinia urna quis, tempus libero. Ut et eros imperdiet, gravida dui vel,
              malesuada nisi. Fusce suscipit odio a nisl varius pulvinar. Ut laoreet gravida tortor vitae mollis.
              Nunc condimentum sem a iaculis condimentum. Praesent ac sem sed leo euismod malesuada et non erat. Nam
              uscipit lorem lacinia, laoreet leo ac, fermentum quam. Praesent leo ante, feugiat vel lacus at,
              ultrices malesuada est. Fusce hendrerit facilisis dui nec lacinia. Mauris ut ornare massa.
            </p>

            <p>
              Integer sed tempus quam. Ut euismod nibh tempus, dictum quam id, porta arcu. Maecenas orci lorem,
              finibus eu dignissim sit amet, pulvinar viverra augue. Nulla mollis velit eu mauris feugiat congue.
              Phasellus sit amet convallis mi, nec porttitor purus. Nulla elementum semper nisl, id scelerisque nibh
              commodo efficitur. Quisque imperdiet sagittis commodo. Donec posuere augue a lorem suscipit vehicula.
              Etiam vel maximus elit, ac porta orci.
            </p>

            <p>
              In id lobortis nulla. Fusce placerat neque sed nibh dignissim, eget feugiat metus ultricies. Sed
              sagittis in tortor id maximus. Quisque tempor tortor vitae leo commodo, nec iaculis ipsum gravida.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer
              auctor eu mauris et imperdiet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Vivamus vel enim bibendum, luctus est eget, sagittis enim. Sed at euismod felis.
            </p>

            <p>
              In lobortis lorem ac sapien facilisis, eu pretium arcu scelerisque. Sed risus erat, pretium eu
              egestas at, pulvinar id elit. In elementum quam vitae libero auctor, a elementum ipsum ornare.
              Aenean luctus, ipsum vel cursus eleifend, urna massa pharetra enim, nec hendrerit dolor lorem at mi.
              ed et dolor turpis. In blandit sem felis, nec rhoncus justo maximus ac. Vivamus venenatis consequat
              sem, sit amet consequat tortor condimentum et. Aliquam ultricies magna at est pharetra interdum.
              Morbi ut bibendum mauris. Vivamus sodales tempor aliquam. Praesent eu arcu porttitor, ultrices
              urna quis, tempor justo. Nullam venenatis facilisis ipsum a pellentesque. Donec facilisis efficitur
              lacus, nec posuere purus lobortis quis. Aenean fermentum nisi elit, ac rutrum arcu ornare sed.
              Aliquam erat felis, commodo et diam id, fermentum scelerisque sem. Donec ac egestas leo, vehicula
              porttitor lectus.
            </p>

            <p>
              Vestibulum non dui accumsan, lacinia urna quis, tempus libero. Ut et eros imperdiet, gravida dui vel,
              malesuada nisi. Fusce suscipit odio a nisl varius pulvinar. Ut laoreet gravida tortor vitae mollis.
              Nunc condimentum sem a iaculis condimentum. Praesent ac sem sed leo euismod malesuada et non erat. Nam
              uscipit lorem lacinia, laoreet leo ac, fermentum quam. Praesent leo ante, feugiat vel lacus at,
              ultrices malesuada est. Fusce hendrerit facilisis dui nec lacinia. Mauris ut ornare massa.
            </p>

            <p>
              In id lobortis nulla. Fusce placerat neque sed nibh dignissim, eget feugiat metus ultricies. Sed
              sagittis in tortor id maximus. Quisque tempor tortor vitae leo commodo, nec iaculis ipsum gravida.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer
              auctor eu mauris et imperdiet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Vivamus vel enim bibendum, luctus est eget, sagittis enim. Sed at euismod felis.
            </p>

            <p>
              Integer sed tempus quam. Ut euismod nibh tempus, dictum quam id, porta arcu. Maecenas orci lorem,
              finibus eu dignissim sit amet, pulvinar viverra augue. Nulla mollis velit eu mauris feugiat congue.
              Phasellus sit amet convallis mi, nec porttitor purus. Nulla elementum semper nisl, id scelerisque nibh
              commodo efficitur. Quisque imperdiet sagittis commodo. Donec posuere augue a lorem suscipit vehicula.
              Etiam vel maximus elit, ac porta orci.
            </p>

          </div>

          <div className={styles.formButtons}>
            <button className={styles.submitButton} onClick={this.handleAccept}>
              <FormattedMessage id="iAcceptTheTerms" />
            </button>
          </div>
        </div>

      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    isError: isError(state),
    isException: isException(state),
    error: state.error,
    termsAccepted: areTermsAccepted(state),
    isRegistered: isRegistered(state)
  };
};

export default connect(mapStateToProps)(TermsPage);
