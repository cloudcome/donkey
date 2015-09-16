# ui/validation/
表单验证

# 验证规则
表单验证规则来源于3个地方

- libs/validation-rules.js 内置的规则
- ui/validation/validation-rules.js 内置的规则
- libs 层或者 ui 层自定义的规则

内置规则有：

- type\[属性]: number/integer/mobile/email/url 数据类型
- required\[属性]: true/false 是否必填
- minLength: <Number> 最小长度
- maxLength: <Number> 最大长度
- maxlength\[属性]: <Number> 最大长度
- equal: <name> 等于
- min\[属性]: <Number> 数值最小值
- max\[属性]: <Number> 数值最大值
- step\[属性]: <Number> 数值步进值
- accept\[属性]: <String> 文件类型
- pattern\[属性]: <String> 正则字符串
- minSize: <Number> 图片最小尺寸
- maxSize: <Number> 图片最大尺寸
- minWidth: <Number> 图片最小宽度
- maxWidth: <Number> 图片最大宽度
- minHeight: <Number> 图片最小高度
- maxHeight: <Number> 图片最大高度


# DOM 规则写法
规则来源于 html 里的`data-validation`属性：

```
<input type="text" data-validation="type:email,minLength:5,maxLength:12">
```

如上，验证规则按顺序为

1. type
2. minLength
3. maxLength

按顺序进行依次验证，如果验证失败，则退出队列。


# JS 规则写法



# 消息来源


