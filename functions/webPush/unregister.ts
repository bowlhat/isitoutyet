import './vapidKey';

import { Project, PushSubscription } from '../data/models';

export const UnRegisterPushNotification = async (req, res) => {
  const { subscription } = req.body;
  if (!subscription) {
    return res.send(403);
  }

  const project = await Project.findOne({
    where: {
      slug: req.params.project,
    },
  });
  if (!project) {
    return res.sendStatus(404);
  }

  const savedSubscriptions = await PushSubscription.findAll({
    where: {
      subscription: JSON.stringify(subscription),
      projectId: project['id'],
    },
  });
  if (savedSubscriptions) {
    await PushSubscription.destroy({
      where: {
        id: savedSubscriptions.map(sub => sub['id']),
      },
    });
    return res.sendStatus(200);
  }

  return res.sendStatus(404);
}
