import {firestore} from '../firebase';

const projRef = firestore.collection('projects');

const versionForProject = async (requestedProject, version) => {
  version = version.trim();

  const noReleases = {
    text: (version) ? `I can't find any information for ${requestedProject} ${version}.`
                    : `I don't know what the latest version of ${requestedProject} is.`,
    data: {},
    cardTitle: `No information for ${requestedProject}`,
    image: '',
  };

  try {
    const proj    = requestedProject.trim().toLowerCase(),
          relRef  = projRef.doc(proj).collection('releases'),
          project = await projRef.doc(proj).get().then(snapshot => snapshot.data());
    
    if (project) {
      const image = project['logo'].startsWith('https://') ?
                      project['logo'] : `https://isitoutyet.info${project['logo']}`;
    
      const release = [
        ...await relRef.where('version', '==', version).get().then(snapshot => snapshot.docs),
        ...await relRef.where('codename', '==', version).get().then(snapshot => snapshot.docs),
      ]
      .map(i => i.data())
      .sort((a, b) => {
        const aDate = a.date.toDate(),
              bDate = b.date.toDate();
        if (aDate > bDate) {
          return -1;
        }
        if (aDate < bDate) {
          return 1;
        }
        return 0;
      }).shift();

      let cardTitle = `Latest version of ${project.name}`;
      if (release) {
        const url         = `https://isitoutyet.info/projects/${project.id}/${release.id}`,
              date        = release.date.toDate(),
              versionName = `${release.version}${release.codename && ` ${release.codename}`}${release.islts && ' Long Term Support'}`;

        let text = `The latest release of ${project.name} is ${versionName}. It was released on %date%.`;

        if (version) {
          text      = `${project.name} ${versionName} was released on %date%.`;
          cardTitle = `${project.name} ${versionName}`;
        }
          
        return {
          text: text.replace('%date%', date.toDateString()),
          ssml: text.replace('%date%', `<say-as interpret-as='date'>${date.toDateString()}</say-as>`),
          data: {
            Project: project.name,
            Version: release.version,
            Codename: release.codename,
            Date: date,
          },
          cardTitle,
          image,
          url,
        };
      }
    }

    return noReleases;
  } catch (e) {
    console.log('Voice interface: Error:', e);
    return noReleases;
  }
};

export { versionForProject };
