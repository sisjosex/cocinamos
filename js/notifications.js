// wait for device to be ready
window.document.addEventListener('deviceready', function() {
 
  // initiate the push plugin. 
  // For more info on this see https://github.com/jackpocket/cordova-plugin-facebook-push-campaign.git
  pushPlugin
    .init({
      ios: {
        badge:      'true',
        sound:      'true',
        alert:      'true',
        clearBadge: 'true',
      }
    })
    // wait for the plugin to register the Push Token 
    .on('registration', function(pushToken) {
      // grab the token and pass it to Facebook
      cordova.plugins.FacebookPushCampaign.register(pushToken);
    });

  GappTrack.track("923763813", "IKvfCO-lym8Q5Yi-uAM", "0.00", "NO");
});
