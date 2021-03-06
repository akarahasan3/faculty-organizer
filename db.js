const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt2017559","root","root",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.predmet = sequelize.import(__dirname+'/predmet.js');
db.grupa = sequelize.import(__dirname+'/grupa.js');
db.aktivnost = sequelize.import(__dirname+'/aktivnost.js');
db.dan = sequelize.import(__dirname+'/dan.js');
db.tip = sequelize.import(__dirname+'/tip.js');
db.student = sequelize.import(__dirname+'/student.js');

//relacije
// Veze 1-n
db.predmet.hasMany(db.grupa,{as:'predmetGrupa', foreignKey:{allowNull:false}});
db.grupa.belongsTo(db.predmet);
db.predmet.hasMany(db.aktivnost,{as:'predmetAktivnost', foreignKey:{allowNull:false}});
db.aktivnost.belongsTo(db.predmet);
db.aktivnost.hasMany(db.dan,{as:'aktivnostDan', foreignKey:{allowNull:false}});
db.dan.belongsTo(db.aktivnost);
db.aktivnost.hasMany(db.tip,{as:'aktivnostTip', foreignKey:{allowNull:false}});
db.tip.belongsTo(db.aktivnost);

// Veza 0-n
db.grupa.hasMany(db.aktivnost,{as:'grupaAktivnost'});
db.aktivnost.belongsTo(db.grupa);

// Veza n-m autor moze imati vise knjiga, a knjiga vise autora
db.studentGrupa=db.grupa.belongsToMany(db.student,{as:'student',through:'student_grupa',foreignKey:'grupaId'});
db.student.belongsToMany(db.grupa,{as:'grupa',through:'student_grupa',foreignKey:'studentId'});


module.exports=db;
