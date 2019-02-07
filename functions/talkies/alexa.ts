import alexa from 'alexa-app';
import { versionForProject } from './common';

export const Alexa = app => {
  const alexaApp = new alexa.app('iioy'); // eslint-disable-line new-cap
  alexaApp.express({
    expressApp: app,
    checkCert: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
    endpoint: 'api/talkies/alexa',
  });

  alexaApp.intent('releaseInfo', undefined, (req, res) => {
    let requestedProject = req.slot('projectslot') || '';
    let version = req.slot('versionslot') || '';

    requestedProject = requestedProject.trim();
    version = version.trim();

    if (!requestedProject) {
      res.getDirectives().set({
        type: 'Dialog.Delegate',
      });
      return res.shouldEndSession(false);
    }

    return versionForProject(requestedProject, version)
      .then(utterance => {
        res.say(utterance.ssml || utterance.text)
        .card({
          type: 'Standard',
          title: utterance.cardTitle,
          text: utterance.text,
          image: {
            smallImageUrl: utterance.image,
          },
        });
      })
      .catch(() => {
        res.say(`I can't answer that right now because something is broken. Please try later.`)
      });
  });

  alexaApp.intent("AMAZON.HelpIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var helpOutput = "You can say 'tell me about Ubuntu' or ask 'when was Ubuntu Xenial released?'. You can also say stop or exit to quit.";
    var reprompt = "What would you like to do?";
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  });
  
  alexaApp.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var stopOutput = "OK.";
    response.say(stopOutput);
  });
  
  alexaApp.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var cancelOutput = "No problem. Request cancelled.";
    response.say(cancelOutput);
  });
};