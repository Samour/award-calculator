import { developmentFlags } from './development';
import { productionFlags } from './production';

const environmentFlags = {
  'development': developmentFlags,
  'production': productionFlags,
  'test': undefined,
};

const effectiveFlags = environmentFlags[process.env.NODE_ENV] || environmentFlags['production'];

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Effective flags:`);
console.log(effectiveFlags);

export default effectiveFlags;
