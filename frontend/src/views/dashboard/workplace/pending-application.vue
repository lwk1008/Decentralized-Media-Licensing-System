<template>
  <page-container :showBreadcrumb="true">
    <a-table
      :loading="context.loading"
      :dataSource="context.dataSource"
      :scroll="{ x: 1000, y: 800 }"
    >
      <a-table-column key="mediaId" title="Media ID" data-index="mediaId" />
      <!-- <a-table-column key="mediaName" title="Media Name" data-index="mediaName" /> -->
      <a-table-column key="license" title="License" data-index="license">
        <template #default="{ record }">
          {{ record.licenseName ? record.licenseName : record.license }}
        </template>
      </a-table-column>
      <a-table-column key="applicant" title="Applicant" data-index="applicant" />
      <a-table-column key="usage" title="Usage" data-index="usage" />
      <a-table-column key="dateOfUse" title="Date of Use" data-index="dateOfUse" />
      <a-table-column
        key="applicantAddress"
        title="Applicant Address"
        data-index="applicantAddress"
      />
      <a-table-column key="hash" title="RAF Hash" data-index="hash">
        <template #default="{ text: hash }">
          <a :href="'/viewer/' + hash">{{ hash }}</a>
        </template>
      </a-table-column>
      <a-table-column key="status" title="Status" data-index="status">
        <template #default="{ text: status }">
          <span>
            <a-tag v-if="status == 0" color="blue">Pending</a-tag>
            <a-tag v-else-if="status == 1" color="green">Approved</a-tag>
            <a-tag v-else-if="status == 2" color="red">Decline</a-tag>
          </span>
        </template>
      </a-table-column>
      <a-table-column key="action" title="Action">
        <template #default="{ record }">
          <span v-if="record.status === 0">
            <a
              @click="
                handleApprove(
                  record.hash,
                  1,
                  record.applicant,
                  record.usage,
                  record.dateOfUse,
                  record.license,
                  record.applicantAddress,
                )
              "
            >
              Approve
            </a>
            <a-divider type="vertical" />
            <a
              @click="
                handleApprove(
                  record.hash,
                  2,
                  record.applicant,
                  record.usage,
                  record.dateOfUse,
                  record.license,
                  record.applicantAddress,
                )
              "
            >
              Decline
            </a>
          </span>
        </template>
      </a-table-column>
    </a-table>
  </page-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { notification } from 'ant-design-vue';
import { ethers } from 'ethers';
import request from '@/utils/request';

async function getData(): Promise<any> {
  return request.get('/raf/rafToApproveByaddress');
}

export default defineComponent({
  setup() {
    const { reload, context } = useFetchData(() => {
      return getData().then(res => {
        return {
          data: res.data.doc,
          total: 100,
        };
      });
    });
    const handleApprove = (
      hash: any,
      status: any,
      applicant: any,
      usage: any,
      dateOfUse: any,
      license: any,
      applicantAddress: any,
    ) => {
      const contractABI = [
        {
          inputs: [
            {
              internalType: 'string',
              name: '_addr',
              type: 'string',
            },
          ],
          name: 'remove',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_addr',
              type: 'string',
            },
            {
              internalType: 'string',
              name: '_i',
              type: 'string',
            },
          ],
          name: 'set',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_addr',
              type: 'string',
            },
          ],
          name: 'get',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          name: 'myMap',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ];

      const { ethereum } = window as any;
      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async () => {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const msg = applicant + usage + dateOfUse + license + applicantAddress + status;
          const approverSignature = await signer.signMessage(msg);
          //Store to smart Contract
          const contractAddr = '0x90e3Cf8B3077E5d2C83c0F7764836D46cca7376c';
          const contractInstance = new ethers.Contract(contractAddr,contractABI,signer);
          await contractInstance.set(hash,approverSignature);
          request
            .post('/raf/update', {
              hash,
              status,
            })
            .then(() => {
              reload();
              notification.success({
                message: 'Saved',
                description: 'Application ' + (status === 1 ? 'Approved' : 'Declined') + '.',
                duration: 4.5,
              });
            });
        })
        .catch(error => {
          notification.error({
            message: 'Error',
            description: 'You need to install and unlock MetaMask to sign',
            duration: 4.5,
          });
          console.log('error', error);
        });
    };
    return {
      context,
      reload,
      handleApprove,
    };
  },
});
</script>
