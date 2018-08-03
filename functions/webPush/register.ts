import { Request, Response } from 'firebase-functions';

import { admin } from '../firebase';
import { Project } from '../data/models';

export const RegisterPushNotification = (req: Request, res: Response) => {
  const { subscription } = req.body;
  if (!subscription) {
    console.error('No push subscription data provided by client');
    return res.sendStatus(403);
  }

  Project.findOne({
    where: {
      slug: req.params.project,
    },
  }).then(async project => {
    if (project) {
      return admin.messaging().subscribeToTopic(subscription, project['slug'])
      .then(response => {
        console.log('Register push: Successfully subscribed:', response);
        res.sendStatus(200);
      }).catch(e => {
        console.log('Register push: Error subscribing:', e);
        res.sendStatus(500);
      });
    }

    console.error('Register push: Project does not exist:', req.params.project);
    res.sendStatus(404);
  }).catch(e => {
    console.error('Register push: Error looking-up project:', e);
    res.sendStatus(404);
  })
}
