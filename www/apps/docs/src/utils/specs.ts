export const specs = {
  workflows: {
    "hello-world": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#F9FAFB',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'clusterBkg': 'transparent',\n        'clusterBorder': 'transparent'\n      }\n    }\n  }%%\n  \tflowchart LR\n  \tsubgraph\n\t\tstartStep[\"`Start\n  \tinput: {#quot;name#quot;:#quot;string#quot;}\n  \t`\"]\n\tstep1[step-1]\n\tstep2[step-2]\n\tend\n\tsubgraph\n\tstep3[step-3]\n\tstep4[step-4]\n\tendStep[\"`End\n  \toutput: {#quot;message#quot;:#quot;string#quot;}\n  \t`\"]\n\tstartStep --> step1 --> step2 --> step3 --> step4 --> endStep",
      code: "createWorkflow<WorkflowInput, WorkflowOutput>(\n  \"hello-world\",\n  function (input) {\n    const str1 = step1({})\n    const str2 = step2(input)\n    const str3 = step3(input)\n    const str4 = step4(input)\n\n    const result = transform(\n      {\n        str1,\n        str2,\n      },\n      (input) => ({\n        message: `${input.str1}\\n${input.str2}`,\n      })\n    )\n\n    return result\n  }\n)",
    },
  },
}
