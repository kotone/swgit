var shell = require('shelljs');
var path = require("path");
var fs = require('fs');
var sshDirPath =  path.join(__dirname, '../ssh');
var jsonPath = path.join(__dirname, '../gitinfo.json');


var showAccountList = function () {
  readGitInfo(function(res) {
    var active = res.active
    res.git.forEach(item => {
      var dot = active === item.mode ? '=>  ' : '    '
      var info = dot + item.mode + ':'
      console.log(info, item.name, item.email)
    })
  })
}
var clearsshFiles = function () {
  shell.rm('-rf', localSshDirPath() + '/*');
}

var copyModeAccountFiles = function (mode, changeMode) {
  var localPath = localSshDirPath()
  var copyDir = sshDirPath + '/' + mode
  if (!shell.test('-e', copyDir)) {
    shell.mkdir(copyDir)
  }
  if (!changeMode) {
    shell.cp('-Rf', localPath + '/*', copyDir);
  } else {
    shell.cp('-Rf', copyDir + '/*', localPath);
  }
}

var saveAccount = function ([mode, name, email]) {
  if (checkssh()) {
    // 当前 mode 是否存在如果存在就不保存
    if (shell.test('-e', sshDirPath + '/' + mode)) return
    // 写入 git 信息
    updataGit(mode, name, email)
    // 拷贝当前 .shh
    copyModeAccountFiles(mode)
    // 改变 gitconfig
    resetGit(name, email)
    console.log('账户：', email, '保存成功')
    setTimeout(() => {
      switchAccount(mode)
    }, 300)
  } else {
    shell.echo('还未创建过 ssh 账户');
    shell.exit(1);
  }
}

var switchAccount = function (mode, save = false) {
  if (checkssh()) clearsshFiles()
  if (!save) copyModeAccountFiles(mode, true)
  readGitInfo(function(res) {
    var gitInfo = res.git.find(item => item.mode === mode)
    res.active = mode
    resetGit(gitInfo.name, gitInfo.email)
    writeGitInfo(res)
  })
}

var updataGit = function (mode, name, email) {
  readGitInfo(function(res) {
    if (res.git.some(item => item.mode === mode)) {
      console.log('已存在 git 信息')
      return;
    } else {
      res.git.push({
        "mode": mode,
        "name": name,
        "email": email
      })
    }
    writeGitInfo(res)
  })
}

var readGitInfo = function (callback) {
  fs.readFile(jsonPath, 'utf-8', function(err, data) {
    if (err) return;
    var res = JSON.parse(data, null, 2)
    callback && callback(res)
  })
}

var writeGitInfo = function (data, callback) {
  var str = JSON.stringify(data, null, 2)
  fs.writeFile(jsonPath, str, function (err, data) {
    if (err) {
      console.log(err)
    }
    callback && callback()
  })
}
/**
 * 本地 ssh 地址
 */
var localSshDirPath = function () {
  shell.cd('~');
  var path = shell.pwd() + '/.ssh';
  return path
}
/**
 * 判断本地是否存在ssh
 */
var checkssh = function () {
  var localPath = localSshDirPath()
  return shell.test('-e', localPath) && shell.test('-e', localPath + '/id_rsa.pub')
}

var resetGit = function (name, email) {
  var nameShellString = 'git config --global user.name ' + name
  var emailShellString = 'git config --global user.email ' + email
  shell.exec(nameShellString)
  shell.exec(emailShellString)
  console.log('当前git:', name, email)
}

module.exports = {
  switchAccount: switchAccount,
  saveAccount: saveAccount,
  showAccountList: showAccountList
}


