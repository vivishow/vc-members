# 会员管理系统

## API:

| **URL**                  | **HTTP Verb** | **Action**                        |
| ------------------------ | ------------- | --------------------------------- |
| /api/members             | GET           | Return All members info           |
| /api/members/:id         | GET           | Return a SINGLE member info       |
| /api/members             | POST          | Add a member                      |
| /api/members/:id/points  | POST          | Add a new points record to member |
| /api/members/:id/contact | POST          | Add a new contact info to member  |
| /api/members/:id         | PUT           | Update a member info              |
| /api/members/:id/contact | PUT           | Update a contact info             |
| /api/members/:id         | DELETE        | Delete a member                   |
| /api/members/:id/contact | DELETE        | Delete a member contact info      |
