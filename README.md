# swgit
用于管理 / 切换 Git 账户。
### 使用
1. 安装后执行 `swgit -s [mode] [name] [Email]`
> mode：要保存的模式，例如： work 模式  
name：Git 账户名  
email：Git 账户  

2. 执行第一步后，再生成新的 ssh key（新账户）， 再执行第一步，保存新生成的账户  
3. 往返执行 1 2 步，可添加多个 git 账户

#### 命令 
> 切换模式： `swgit -m [模式名称]`  
保存当前账户： `swgit -s [模式] [账户名] [账户邮箱]`  
显示当前/保存的模式： `swgit -l`

