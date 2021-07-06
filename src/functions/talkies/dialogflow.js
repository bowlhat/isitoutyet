import * as functions from 'firebase-functions';

export const DialogFlow = async (request, response) => {
  const {WebhookClient, Card, Text} = await import('dialogflow-fulfillment');
  const {versionForProject} = await import('./common');
  
  let DIALOGFLOW_BASIC_AUTH = '';
  if (functions.config().dialogflow) {
    DIALOGFLOW_BASIC_AUTH = functions.config().dialogflow.basicauth || '';
  }
  const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
  
  const sorry = {
    fulfillmentText: `Sorry, I can't help you with that..`,
  };

  const match = CREDENTIALS_REGEXP.exec(request.headers.authorization);
  if (DIALOGFLOW_BASIC_AUTH && (!match || match[1] !== DIALOGFLOW_BASIC_AUTH)) {
    return response.status(403).send('Unauthorized');
  }

  const agent = new WebhookClient({ request, response });

  function welcome(agent) {
    agent.add(`Welcome to Is It Out Yet!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  async function releaseInfo(agent) {
    let requestedProject = agent.parameters.Project || '';
    let version = agent.parameters.Version || '';
    
    requestedProject = requestedProject.trim();
    version = version.trim();

    try {
      const utterance = await versionForProject(requestedProject, version);
      const text = new Text(utterance.text);
      if (utterance.ssml) {
        text.setSsml(`<speak>${utterance.ssml}</speak>`);
      };
      agent.add(text);

      for (const platform of ['FACEBOOK', 'SLACK', 'TELEGRAM', 'KIK', 'SKYPE', 'LINE', 'VIBER', 'ACTIONS_ON_GOOGLE']) {
        const card = new Card(utterance.cardTitle);
        card.setImage(utterance.image);
        card.setText(utterance.text);
        card.setPlatform(platform);
        if (utterance.url) {
          card.setButton({
            text: `Open the release notes...`,
            url: utterance.url,
          });
        }
        agent.add(card);
      }
    } catch (e) {
      agent.add(`I can't answer that right now because something is broken. Please try later.`);
    }
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Release info', releaseInfo);
  agent.handleRequest(intentMap);
}
