import { Request, Response } from 'firebase-functions';

import { admin } from '../firebase';
import { Project } from '../data/models';

export const UnRegisterPushNotification = (req: Request, res: Response) => {
  const { subscription } = req.body;
  if (!subscription) {
    return res.send(403);
  }

  Project.findOne({
    where: {
      slug: req.params.project,
    },
  }).then(async project => {
    if (project) {
      return admin.messaging().unsubscribeFromTopic(subscription, project['slug'])
      .then(response => {
        console.log('Unregister push: Successfully unsubscribed:', response);
        res.sendStatus(200);
      }).catch(e => {
        console.log('Unregister push: Error unsubscribing:', e);
        res.sendStatus(500);
      })
    }

    console.error('Unregister push: Project does not exist:', req.params.project);
    return res.sendStatus(404);
  }).catch(e => {
    console.log('Unregister push: Error looking-up project:', e);
    res.sendStatus(500);
  });
}
