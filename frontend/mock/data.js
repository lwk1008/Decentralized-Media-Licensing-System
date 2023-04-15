let applications = [
  {
    id: btoa(Math.random().toString()).substr(10, 10),
    mediaId: 'xxx1',
    mediaName: 'Media 1',
    license: 'License 1',
    applicant: 'Applicant 1',
    usage: 'Usage 1',
    dateOfUse: '2022-01-11 - 2022-02-01',
    applicantAddress: btoa(Math.random().toString()).substr(10, 10),
    hash: btoa(Math.random().toString()).substr(10, 10),
    status: 'pending',
  },
  {
    id: btoa(Math.random().toString()).substr(10, 10),
    mediaId: 'xxx2',
    mediaName: 'Media 2',
    license: 'License 2',
    applicant: 'Applicant 2',
    usage: 'Usage 2',
    dateOfUse: '2022-01-11 - 2022-02-01',
    applicantAddress: btoa(Math.random().toString()).substr(10, 10),
    hash: btoa(Math.random().toString()).substr(10, 10),
    status: 'approved',
  },
  {
    id: btoa(Math.random().toString()).substr(10, 10),
    mediaId: 'xxx3',
    mediaName: 'Media 3',
    license: 'License 3',
    applicant: 'Applicant 3',
    usage: 'Usage 3',
    dateOfUse: '2022-01-11 - 2022-02-01',
    applicantAddress: btoa(Math.random().toString()).substr(10, 10),
    hash: btoa(Math.random().toString()).substr(10, 10),
    status: 'decline',
  },
];

module.exports = {
  'GET /api/raf/rafbyaddress': (req, res) => {
    res.send(applications);
  },
  'POST /api/raf/create': (req, res) => {
    const body = req.body;
    applications = [body].concat(applications);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 800);
    }).then(() => {
      res.send(applications);
    });
  },
  'POST /api/raf/update': (req, res) => {
    const body = req.body;
    const row = applications.find(row => row.id == body.id);
    if (row) {
      row.status = body.status;
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 800);
    }).then(() => {
      res.send(applications);
    });
  },
  'POST /api/media/createMedia': (req, res) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 800);
    }).then(() => {
      res.send({
        id: 'id-001',
      });
    });
  },
};
