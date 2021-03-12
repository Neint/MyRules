## 说明：
* 项目来源：
  > https://gitee.com/lxk0301/jd_docker/tree/master

---
## 挂机方式一：云函数方式
1. 新建云函数，选自定义创建
2. 填写`函数名称`，运行环境选`Nodejs12.16`
3. 函数代码选`本地上传文件夹`，将`jd_script`或`jd_scripts_crazy_joy_coin`文件夹上传到腾讯云函数
4. 高级-环境配置，内存选`64MB`，执行超时`600`秒
5. 高级-环境配置-环境变量，增加下面的环境变量
   ```properties
   #环境变量：
   CRZAY_JOY_COIN_ENABLE=N
   JD_COOKIE=pt_key=AAJgSNrsADAS4xtK3wmo1eZQJWR63OyYMq87JFNZo9OmHEaMeqY22KsJHz5soqMppk5TlUTiLOI;pt_pin=Neint;&pt_key=AAJgSYqxADABG5rcVYL-e3vTCEwofGhm10BBZy67-ezCtEhf5y4F972EMIm6cnNpMbKJ0OBAauo; pt_pin=jd_7b1c5d479a095;
   RANDOM_DELAY_MAX=120
   TENCENTSCF_SOURCE_TYPE=local
   TENCENTSCF_SOURCE_URL=https://jdsharedresourcescdn.azureedge.net/jdresource/
   TG_BOT_TOKEN=1536371451:AAGcDyGALk1jTicB2G16hl6z1xz60Br49lQ
   TG_USER_ID=362944233
   ```
6. 点击完成，然后配置触发器：

    ```bash
    # 1 crazyJoy挂机
    #Cron表达式：
    0 */3 2-11,14-23 * * * *
    0 */10 0,1,12,13 * * * *
    #附加信息：
    jd_crazy_joy_coin
    
    # 2 宠汪汪积分兑换奖品 
    #Cron表达式：
    55-59 59 23,7,15 * * * *
    0-15 0 0,8,16 * * * *
    #附加信息：
    jd_joy_reward

    # 3 京东汽车兑换
    #Cron表达式：
    55-59 59 23 */1 * * *
    0-15 0 0 */1 * * *
    #附加信息：
    jd_car_exchange
    ```

---
## 挂机方式二：通过VPS搭建Docker运行

1. 安装docker-compose
  > docker-compose 安装（群晖nas docker自带安装了docker-compose）
  > 通过docker-compose version查看docker-compose版本，确认是否安装成功
  >> 附：Docker安装 国内一键安装 sudo curl -sSL https://get.daocloud.io/docker | sh 国外一键安装 sudo curl -sSL get.docker.com | sh

2. 创建一个目录*jd_scripts*用于存放备份配置等数据，迁移重装的时候只需要备份整个jd_scripts目录即可
   ```bash
   # 目录文件结构参考如下:
   jd_scripts
   ├── logs
   │   ├── XXXX.log
   │   └── XXXX.log
   ├── my_crontab_list.sh
   └── docker-compose.yml
   ```

   - `jd_scripts/logs`建一个空文件夹就行
   - `jd_scripts/docker-compose.yml` `参考内容如下(自己动手能力不行搞不定请使用默认配置)：
   - - [使用默认配置用这个](./example/default.yml)
   - - [使用自定义任务追加到默认任务之后用这个](./example/custom-append.yml)
   - - [使用自定义任务覆盖默认任务用这个](./example/custom-overwrite.yml)
   - `jd_scripts/docker-compose.yml`里面的环境变量(`environment:`)配置[参考这里](./example/githubAction.md#互助码类环境变量)
   - `jd_scripts/my_crontab_list.sh` 参考内容如下,自己根据需要调整增加删除，不熟悉用户推荐使用默认配置：

   ```shell
   # 每3天的23:50分清理一次日志(互助码不清理，proc_file.sh对该文件进行了去重)
   50 23 */3 * * find /scripts/logs -name '*.log' | grep -v 'sharecode' | xargs rm -rf
   # 签到
   3 0,18 * * * cd /scripts && node jd_bean_sign.js |ts >> /scripts/logs/jd_bean_sign.log 2>&1
   # 宠汪汪
   15 */2 * * * node /scripts/jd_joy.js |ts >> /scripts/logs/jd_joy.log 2>&1
   # 宠汪汪喂食
   15 */1 * * * node /scripts/jd_joy_feedPets.js |ts >> /scripts/logs/jd_joy_feedPets.log 2>&1
   # 宠汪汪偷好友积分与狗粮
   13 0-21/3 * * * node /scripts/jd_joy_steal.js |ts >> /scripts/logs/jd_joy_steal.log 2>&1
   # 东东工厂
   36 * * * * node /scripts/jd_jdfactory.js |ts >> /scripts/logs/jd_jdfactory.log 2>&1
   ```

3. 目录文件配置好之后在 `jd_scripts`目录执行。  

    `docker-compose up -d` 启动（修改docker-compose.yml后需要使用此命令使更改生效）；  
    `docker-compose logs` 打印日志；  
    `docker-compose pull` 更新镜像；  
    `docker-compose stop` 停止容器；  
    `docker-compose restart` 重启容器；  
    `docker-compose down` 停止并删除容器；  

4. 你可能会用到的命令

    `docker exec -it jd_scripts /bin/sh -c 'git -C /scripts pull && node /scripts/jd_bean_change.js'`  手动运行一脚本   
    `docker exec -it jd_scripts /bin/sh -c 'env'`  查看设置的环境变量  
    `docker exec -it jd_scripts /bin/sh -c 'git pull'` 手动更新jd_scripts仓库最新脚本  
    `docker exec -it jd_scripts /bin/sh` 仅进入容器命令   
    `rm -rf  logs/*.log` 删除logs文件夹里面所有的日志文件   

### DOCKER专属环境变量
|        Name       |      归属      |  属性  | 说明                                                         |
| :---------------: | :------------: | :----: | ------------------------------------------------------------ |
| `CRZAY_JOY_COIN_ENABLE` | 是否jd_crazy_joy_coin挂机 | 非必须 | docker-compose.yml文件下填写`CRZAY_JOY_COIN_ENABLE=Y`表示挂机,`CRZAY_JOY_COIN_ENABLE=N`表不挂机 |
| `DO_NOT_RUN_SCRIPTS` | 不执行的脚本 | 非必须 | 例:docker-compose.yml文件里面填写`DO_NOT_RUN_SCRIPTS=jd_family.js&jd_dreamFactory.js&jd_jxnc.js`, 建议填写完整脚本名,不完整的文件名可能导致其他脚本被禁用 |
| `ENABLE_AUTO_HELP` | 单容器多账号自动互助 | 非必须 | 例:docker-compose.yml文件里面填写`ENABLE_AUTO_HELP=true` |

---
### 附：腾讯云函数-京东任务通用配置：


####触发器配置：
