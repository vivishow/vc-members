# 会员管理系统

## User stories:

1. 发送 post 请求 'name' 到 '/api/members' 添加一个会员，并返回一个 object 包括 'name', 唯一的'\_id'.
2. 发送 get 请求 '/api/members' 获取一个包括所有会员信息的列表，每个信息包括'name', '\_id', 'points'.
3. 发送 get 请求 '/api/members/{\_id}' 获取一个 object 包括该会员的信息, 'name', '\_id', 'points' 和一个 'points_details' 列表(空列表表示没有积分操作), 'add'(可选的地址信息,包括电话)，
4. 发送 post 请求 'points_detail' 到 '/api/members/{\_id}/points' 添加一条积分操作详情到'points_details',并更改积分'points'.
5. 发送 post 请求 'add,iphone' 到 '/api/members/{\_id}/add' 添加地址和电话信息.
