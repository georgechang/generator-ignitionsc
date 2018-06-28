'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rename = require('gulp-rename');
const uuidV4 = require('uuid/v4');

module.exports = class extends yeoman {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the awesome ' + chalk.red('Sitecore Ignition') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'What is your solution name?'
    },
    {
      type: 'list',
      name: 'layername',
      message: 'Which layer is this going into?',
      choices: ['Foundation', 'Feature', 'Project'],
      default: 'Feature'
    },
    {
      type: 'input',
      name: 'componentname',
      message: 'What is your component name?'
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      console.log('Cool, I\'ll create a project called ' + this.props.projectname + '. Here we go!');
      // To access props later use this.props.someAnswer;
    }.bind(this));
  }

  writing() {
    const year = new Date().getFullYear();
    const guid = uuidV4();
    const _this = this;
    const fullname = this.props.appname + '.' + this.props.layername + '.' + this.props.componentname;
    this.registerTransformStream(rename(function (path) {
      path.dirname = path.dirname.replace(/Application/g, _this.props.appname);
      path.dirname = path.dirname.replace(/Layer/g, _this.props.layername);
      path.dirname = path.dirname.replace(/Component/g, _this.props.componentname);
      path.basename = path.basename.replace(/Application/g, _this.props.appname);
      path.basename = path.basename.replace(/Layer/g, _this.props.layername);
      path.basename = path.basename.replace(/Component/g, _this.props.componentname);
      return path;
    }));
    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationPath(), {
        appname: this.props.appname,
        componentname: this.props.componentname,
        layername: this.props.layername,
        projectname: fullname,
        guid: guid,
        year: year
      }
    );
  }

  install() {
    // This.installDependencies();
  }
};
