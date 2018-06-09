import sequelize from '../data/sequelize';
import { Project, Release } from '../data/models';

const { Op } = sequelize;

const latestVersionForProject = async requestedProject => {
  const project = await Project.findOne({
    where: sequelize.where(
      sequelize.fn('upper', sequelize.col('name')),
      requestedProject.toUpperCase(),
    ),
  });

  if (project) {
    const release = await Release.findOne({
      where: {
        projectId: project['id'],
      },
      order: [
        ['date', 'DESC'],
        sequelize.literal(`string_to_array(version, '.')::int[] DESC`),
      ],
    });

    if (release) {
      return {
        text: `The latest version of ${project['name']} is ${release['version'] ||
          ''} ${release['codename'] || ''} ${release['islts'] &&
          'Long Term Support'}`,
        data: {
          Project: project['name'],
          Version: release['version'],
          Codename: release['codename'],
          Date: new Date(release['date']),
        },
      };
    }

    return {
      text: `I don't know what the latest version of ${project['name']} is.`,
      data: {
        Project: project['name'],
      },
    };
  }

  return {
    text: `Sorry, I don't know about ${requestedProject}'s releases yet..`,
    data: {},
  };
};

const whenWasItReleased = async (requestedProject, version) => {
  const project = await Project.findOne({
    where: sequelize.where(
      sequelize.fn('upper', sequelize.col('name')),
      requestedProject.toUpperCase(),
    ),
  });

  if (project) {
    const where = {
      projectId: project['id'],
    };
    if (version) {
      where[Op.or] = {
        version: { [Op.iLike]: `${version.trim()}%` },
        codename: { [Op.iLike]: `%${version.trim()}%` },
      };
    }

    const release = await Release.findOne({
      where,
      order: [
        ['date', 'DESC'],
        sequelize.literal(`string_to_array(version, '.')::int[] DESC`),
      ],
    });

    if (release) {
      const codename = release['codename'] ? ` ${release['codename']}` : '';
      return {
        Project: project['name'],
        Version: release['version'],
        Codename: codename,
        LTS: release['islts'],
        Date: new Date(release['date']),
      };
    }
  }

  return null;
};

export { latestVersionForProject, whenWasItReleased };
