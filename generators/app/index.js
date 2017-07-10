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
      'Welcome to the awesome ' + chalk.red('Sitecore Ignition') + ' generator!'
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
    ];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      console.log('Cool, I\'ll create a project called ' + this.props.projectname +'. Here we go!');
      // To access props later use this.props.someAnswer;
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
      return path;
    }));
    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationPath(),
      { 
        appname: this.props.appname,
        componentname: this.props.componentname,
        layername: this.props.layername,
        projectname: fullname,
        guid: uuidV4()
       }
    );
  },

  install: function () {
    //this.installDependencies();
  }
});
