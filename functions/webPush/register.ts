import './vapidKey';

import { Project, PushSubscription } from '../data/models';

export const RegisterPushNotification = async (req, res) => {
  const { subscription } = req.body;
  if (!subscription) {
    console.error('No push subscription data provided by client');
    return res.sendStatus(403);
  }

  const project = await Project.findOne({
    where: {
      slug: req.params.project,
    },
  });
  if (!project) {
    console.error('Project does not exist for push subscription');
    return res.sendStatus(404);
  }

  const savedSubscription = await PushSubscription.create({
    subscription: JSON.stringify(subscription),
  });
  if (savedSubscription) {
    await project['addPushSubscription'](savedSubscription);
    return res.sendStatus(200);
  }

  console.error(
    'We reached the end of push subscription function but got confused somewhere',
  );
  return res.sendStatus(404);
}
