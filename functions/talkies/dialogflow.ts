import { latestVersionForProject, whenWasItReleased } from './common';

const DIALOGFLOW_BASIC_AUTH = process.env.DIALOGFLOW_BASIC_AUTH || '';
const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

const sorry = {
  fulfillmentText: `Sorry, I can't help you with that..`,
};

export const DialogFlow = (req, res) => {
  const match = CREDENTIALS_REGEXP.exec(req.headers.authorization);
  if (
    process.env.NODE_ENV === 'development' ||
    !match ||
    match[1] !== DIALOGFLOW_BASIC_AUTH
  ) {
    return res.status(403).send('Unauthorized');
  }

  // const postData = JSON.parse(req.body);
  if ('queryResult' in req.body && 'parameters' in req.body.queryResult) {
    let requestedProject = req.body.queryResult.parameters.Project;
    if (requestedProject) {
      if (
        !('intent' in req.body.queryResult) ||
        req.body.queryResult.intent.displayName === 'Latest version'
      ) {
        requestedProject = requestedProject.replace(/[?!,]*$/, '');

        return latestVersionForProject(requestedProject)
          .then(utterance => {
            const reply = {
              text: utterance.text,
              data: {
                Project: utterance.data.Project,
                Version: utterance.data.Version,
                Codename: utterance.data.Codename,
                Date: 'an unknown date',
              },
            };

            if (utterance.data.Date) {
              reply.data.Date = utterance.data.Date.toDateString();
            }

            res.json({
              fulfillmentText: reply.text || 'WHA. Something went wrong!',
              outputContexts: [
                {
                  name: `${req.body.session}/contexts/latestversion-followup`,
                  lifespanCount: 1,
                  parameters: reply.data || {},
                },
              ],
            });
          })
          .catch(() => res.status(500).send('Error'));
      }

      if (
        req.body.queryResult.intent.displayName ===
        'When was project and version released'
      ) {
        const version = req.body.queryResult.parameters.Version;
        if (version) {
          return whenWasItReleased(requestedProject, version)
            .then(response => {
              if (response !== null) {
                return res.json({
                  fulfillmentText: `${response.Project} ${response.Version}${
                    response.Codename ? ` ${response.Codename}` : ''
                  }${
                    response.LTS ? ' Long Term Support' : ''
                  } was released on ${response.Date.toDateString()}`,
                });
              }

              return res.json({
                fulfillmentText: `Sorry, I don't know when ${requestedProject} ${version} was released..`,
              });
            })
            .catch(() => res.status(500).send('Error'));
        }

        return res.json({
          fulfillmentText: `Sorry, I don't know about that release of ${requestedProject}..`,
        });
      }

      return res.json(sorry);
    }

    return res.json(sorry);
  }

  return res.json(sorry);
};
