## 登录
- 用户登录过
  - 从数据库直接获取用户的信息，并渲染页面
- 用户从未登录过
  - 跳转至登录页面
  - 验证
    - 字段是否不为空
    - 每个字段所填写的是否满足要求
      - 满足格式要求
      - 与存储在数据库中其他用户存储的数据不相同
  - 微信授权登录
    - 需要点击按钮直接调用接口，间接调用没用

### 思路
- 用户字段不为空
  - 当用户失去焦点，去校验
    - 输入的值是否为空
    - 去掉首位的空格，查看是否是空值
  - 将用户输入的值，去掉首位空格，并赋值给data
- 用户输入字段是否满足要求
  - 防抖去控制当用户输入发生改变时
  - 使用switch分支语句去判断是否满足要求
