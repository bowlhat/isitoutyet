import alexa from 'alexa-app';
import { latestVersionForProject, whenWasItReleased } from './common';

export const Alexa = app => {
  const alexaApp = new alexa.app('iioy'); // eslint-disable-line new-cap
  alexaApp.express({
    expressApp: app,
    checkCert: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
    endpoint: 'api/talkies/alexa',
  });

  alexaApp.intent('LatestVersion', undefined, async (req, res) => {
    let requestedProject = req.slot('projectslot', '');
    requestedProject = requestedProject.replace(/[?!,]*$/, '');

    const utterance = await latestVersionForProject(requestedProject);

    res.say(utterance.text);
    res.shouldEndSession(false);

    if (req.hasSession()) {
      const session = req.getSession();
      Object.keys(utterance.data).forEach(key => {
        session.set(key, utterance.data[key]);
      });
    }
  });

  alexaApp.intent('WhenWasItReleased', undefined, async (req, res) => {
    let requestedProject = req.slot('projectslot') || '';
    let version = req.slot('versionslot') || '';
    if (req.hasSession()) {
      if (!requestedProject) {
        requestedProject = req.getSession().get('Project') || '';
      }
      if (!version) {
        version = req.getSession().get('Version') || '';
      }
    }

    if (!requestedProject || !version) {
      res.getDirectives().set({
        type: 'Dialog.Delegate',
      });
      return res.shouldEndSession(false);
    }

    const response = await whenWasItReleased(requestedProject, version);
    if (response !== null) {
      // TODO: Use Locales
      const responseText = `${response.Project} ${response.Version}${
        response.Codename ? ` ${response.Codename}` : ''
      }${
        response.LTS ? ' Long Term Support' : ''
      } was released on <say-as interpret-as='date'>${response.Date.toDateString()}</say-as>`;
      return res.say(responseText);
    }

    return res.say(
      `Sorry, I don't know when ${requestedProject} ${version} was released..`,
    );
  });
};
