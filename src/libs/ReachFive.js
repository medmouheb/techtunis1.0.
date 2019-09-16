import * as identificationAnimation from '../animations/identificationPage'

const ReachFive = {
    showSocialLogin(container, idForText) {
        reach5('showSocialLogin', {
            container: container,
            socialProviders: [
                'facebook',
                'google',
                'paypal'
            ],
            auth: {origin: 'identification_tunnel'},
            onReady: identificationAnimation.togglereachFiveBlock(idForText)
        });
    },

    storeSocialLoginInfosInStorage(callbackFunction) {
        reach5('on', 'authenticated', (authResult) => {
            $.jStorage.set("idToken", authResult.idToken)
            $.jStorage.set("user", authResult.idTokenPayload)
            sessionStorage.setItem('socialProvider', $.jStorage.get("user").authType);
            callbackFunction()
        });
    }
}
export default ReachFive;