import sequelize from '../data/sequelize';
import { Project, Release } from '../data/models';

const { Op } = sequelize;

const versionForProject = async (requestedProject: string, version: string) => {
  const project = await Project.findOne({
    where: sequelize.where(
      sequelize.fn('upper', sequelize.col('name')),
      requestedProject.toUpperCase(),
    ),
  });

  version = version.trim();

  if (project) {
    const image = project['logo'].startsWith('https://') ? project['logo'] : `https://isitoutyet.info${project['logo']}`;

    let versionQuery = {};
    if (version) {
      versionQuery = {
        [Op.or]: {
          version: { [Op.iLike]: `${version}%` },
          codename: { [Op.iLike]: `%${version}%` },
        }
      }
    }
    
    const release = await Release.findOne({
      where: {
        projectId: project['id'],
        ...versionQuery,
      },
      order: [
        ['date', 'DESC'],
        sequelize.literal(`string_to_array(version, '.')::int[] DESC`),
      ],
    });
    
    let cardTitle = `Latest version of ${project['name']}`;
    if (release) {
      const url = `https://isitoutyet.info/projects/${project['slug']}/${release['id']}`;
      const date = new Date(release['date']);
      const versionName = `${release['version']}${release['codename'] && ` ${release['codename']}`}${release['islts'] && ' Long Term Support'}`;
      let text = `The latest release of ${project['name']} is ${versionName}. It was released on %date%.`;
      if (version) {
        text = `The ${versionName} release of ${project['name']} was released on %date%.`;
        cardTitle = `${project['name']} ${versionName}`;
      }
      
      return {
        text: text.replace('%date%', date.toDateString()),
        ssml: text.replace('%date%', `<say-as interpret-as='date'>${date.toDateString()}</say-as>`),
        data: {
          Project: project['name'],
          Version: release['version'],
          Codename: release['codename'],
          Date: date,
        },
        cardTitle,
        image,
        url,
      };
    }

    return {
      text: `I don't know what the latest version of ${project['name']} is.`,
      data: {
        Project: project['name'],
      },
      cardTitle,
      image,
    };
  }

  return {
    text: `Sorry, I don't know about ${requestedProject}'s releases yet..`,
    data: {},
    cardTitle: `No information for ${requestedProject}`,
    image: '',
  };
};

export { versionForProject };
