'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rename = require('gulp-rename');
const uuidV4 = require('uuid/v4');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay('Welcome to the awesome ' + chalk.red('Sitecore Ignition') + ' generator!')
    );

    const prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'What is your solution name?'
      },
      {
        type: 'list',
        name: 'layerName',
        message: 'Which layer is this going into?',
        choices: ['Foundation', 'Feature', 'Project'],
        default: 'Feature'
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'What is your component name?'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      console.log(
        "Cool, I'll create a project called " + this.props.projectname + '. Here we go!'
      );
    });
  }

  writing() {
    var fullName =
      this.props.appName + '.' + this.props.layerName + '.' + this.props.componentName;
    this.registerTransformStream(
      rename(path => {
        path.dirname = path.dirname.replace('Template.Feature', fullName);
        path.dirname = path.dirname.replace(
          'Include\\Template\\Template.Feature',
          'Include\\' + this.props.appName + '\\' + fullName
        );
        path.basename = path.basename.replace('Template.Feature', fullName);
        path.basename = path.basename.replace(
          'FeatureController',
          this.props.componentName + 'Controller'
        );
        return path;
      })
    );
    this.fs.copyTpl(this.templatePath('**'), this.destinationPath(), {
      appName: this.props.appName,
      componentName: this.props.componentName,
      layerName: this.props.layerName,
      projectName: fullName,
      guid: uuidV4()
    });
  }

  install() {
    // This.installDependencies();
  }
};
