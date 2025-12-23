const { exec } = require('child_process');
exec('node -c e:\\indievolve\\mp-weixin\\pages\\indievolve\\scene_detail.js', (error, stdout, stderr) => {
  if (error) {
    console.log('Error Code:', error.code);
    console.log('STDERR:', stderr);
  } else {
    console.log('Syntax OK');
  }
});
