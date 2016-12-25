'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rename = require('gulp-rename');
const uuidV4 = require('uuid/v4');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the wicked ' + chalk.red('Sitecore Ignition') + ' generator!'
    ));

    var prompts = [
      {
        type:     'input',
        name:     'appname',
        message:  'What is your solution name?'
      },
      {
        type:     'list',
        name:     'layername',
        message:  'Which layer is this going into?',
        choices: ['Foundation', 'Feature', 'Project'],
        default: 'Feature'
      },
      {
        type:     'input',
        name:     'componentname',
        message:  'What is your component name?'
      },
      // {
      //   type:     'confirm',
      //   name:     'git',
      //   message:  'Would you like to create a Git repository?',
      //   default:  true
      // }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var _this = this;
    var fullname = _this.props.appname + '.' + _this.props.layername + '.' + _this.props.componentname;
    this.registerTransformStream(rename(function(path) {
      path.dirname = path.dirname.replace("Template.Feature", fullname);
      path.dirname = path.dirname.replace("Include\\Template\\Template.Feature", "Include\\" + _this.props.appname + "\\" + fullname);
      path.basename = path.basename.replace("Template.Feature", fullname);
      path.basename = path.basename.replace("FeatureController", _this.props.componentname + "Controller");
      path.basename = path.basename.replace("FeatureInstaller", _this.props.componentname + "Installer");
      return path;
    }));
    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationPath(),
      { 
        appname: this.props.appname,
        componentname: this.props.componentname,
        layername: this.props.layername,
        projectname: this.props.appname + '.' + this.props.layername + '.' + this.props.componentname,
        guid: uuidV4()
       }
    );
  },

  install: function () {
    this.installDependencies();
  }
});
