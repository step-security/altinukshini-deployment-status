[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

# deployment-status

A GitHub action to update the status of [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

Works great with other action to create Deployments, [step-security/altinukshini-deployment-action](https://github.com/step-security/altinukshini-deployment-action).

## Action inputs

| name              | description                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `pr`             | (optional - default is `false`) If Deployment is being created from a PR |
| `pr_id`          | (optional) Pass the PR ID to this param if `pr` is set to "true"         |
| `state`           | The state to set the deployment to. Must be one of the below: "error" "failure" "inactive" "in_progress" "queued" "pending" "success" |
| `token`           | GitHub token                                                                                                                          |
| `target_url`      | (Optional) The target URL. This should be the URL of the app once deployed                                                            |
| `description`     | (Optional) Descriptive message about the deployment                                                                                   |
| `environment_url` | (Optional) Sets the URL for accessing your environment                                                                                |
| `deployment_id`   | The ID of the deployment to update                                                                                                    |

## Usage example

The below example includes `step-security/altinukshini-deployment-action` and `step-security/altinukshini-deployment-status` to create and update a deployment within a workflow.

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v7

      - uses: step-security/altinukshini-deployment-action@v1
        name: Create GitHub deployment
        id: deployment
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          environment: production

      - name: Deploy my app
        run: |
          # add your deployment code here

      - name: Update deployment status (success)
        if: success()
        uses: step-security/altinukshini-deployment-status@v1
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          state: "success"
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}

      - name: Update deployment status (failure)
        if: failure()
        uses: step-security/altinukshini-deployment-status@v1
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          state: "failure"
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
```
