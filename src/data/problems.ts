
export const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    constraints: [
      "2 ≤ nums.length ≤ 104",
      "-109 ≤ nums[i] ≤ 109",
      "-109 ≤ target ≤ 109",
      "Only one valid answer exists."
    ],
    starterCode: "function twoSum(nums, target) {\n  // Write your code here\n  \n}\n\n// Example usage:\n// twoSum([2, 7, 11, 15], 9) should return [0, 1]"
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    example: "Input: s = ['h','e','l','l','o']\nOutput: ['o','l','l','e','h']",
    constraints: [
      "1 ≤ s.length ≤ 105",
      "s[i] is a printable ascii character.",
      "Do it in-place with O(1) extra memory."
    ],
    starterCode: "function reverseString(s) {\n  // Write your code here\n  \n}\n\n// Example usage:\n// reverseString(['h','e','l','l','o']) should modify the array to ['o','l','l','e','h']"
  },
  {
    id: 3,
    title: "Merge Sorted Arrays",
    difficulty: "Medium",
    category: "Arrays",
    description: "Given two sorted arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.",
    example: "Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\nOutput: [1,2,2,3,5,6]",
    constraints: [
      "nums1.length == m + n",
      "nums2.length == n",
      "0 ≤ m, n ≤ 200",
      "1 ≤ m + n ≤ 200",
      "-109 ≤ nums1[i], nums2[j] ≤ 109"
    ],
    starterCode: "function merge(nums1, m, nums2, n) {\n  // Write your code here\n  \n}\n\n// Example usage:\n// merge([1,2,3,0,0,0], 3, [2,5,6], 3) should modify nums1 to be [1,2,2,3,5,6]"
  },
  {
    id: 4,
    title: "Binary Search Tree Validator",
    difficulty: "Hard",
    category: "Trees",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    example: "Input: root = [2,1,3]\nOutput: true\n\nInput: root = [5,1,4,null,null,3,6]\nOutput: false",
    constraints: [
      "The number of nodes in the tree is in the range [1, 104].",
      "-231 ≤ Node.val ≤ 231 - 1"
    ],
    starterCode: "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\nfunction isValidBST(root) {\n  // Write your code here\n  \n}\n\n// Example usage:\n// isValidBST(new TreeNode(2, new TreeNode(1), new TreeNode(3))) should return true"
  },
  {
    id: 5,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Arrays",
    description: "Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai), n vertical lines are drawn such that the two endpoints of the line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.",
    example: "Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The vertical lines are at indices 1 and 8 with heights 8 and 7. The area of the container is 7 * 7 = 49.",
    constraints: [
      "n == height.length",
      "2 ≤ n ≤ 105",
      "0 ≤ height[i] ≤ 104"
    ],
    starterCode: "function maxArea(height) {\n  // Write your code here\n  \n}\n\n// Example usage:\n// maxArea([1,8,6,2,5,4,8,3,7]) should return 49"
  }
];
