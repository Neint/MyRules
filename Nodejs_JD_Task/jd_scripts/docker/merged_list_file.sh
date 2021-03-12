# 签到
3 0,18 * * * cd /scripts && node jd_bean_sign.js |ts >> /scripts/logs/jd_bean_sign.log 2>&1

# 必须要的默认定时任务请勿删除
11 7 * * * docker_entrypoint.sh |ts >> /scripts/logs/default_task.log 2>&1
