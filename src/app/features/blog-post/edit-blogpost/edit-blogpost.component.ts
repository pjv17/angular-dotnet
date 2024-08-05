import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category-model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageSelectorComponent } from "../../../shared/components/image-selector/image-selector.component";
import { ImageService } from '../../../shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  standalone: true,
  imports: [FormsModule, CommonModule, MarkdownModule, ImageSelectorComponent],
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css'
})
export class EditBlogpostComponent implements OnInit, OnDestroy {

  id: string | null = null;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];
  routeSubscription?: Subscription; 
  getBlogPostSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
  isImageSelectorVisible: boolean = false;
  imageSelectSubscription?: Subscription;

  constructor(private route:ActivatedRoute, 
    private blogPostService: BlogPostService, 
    private categoryService: CategoryService, 
    private router: Router,
    private imageService: ImageService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.routeSubscription = this.route.paramMap.subscribe({
      next: (params) => {
       this.id = params.get('id');

       //Get blog post data from API
       if(this.id) {
        this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
          next: (response) => {
            this.model = response;
            this.selectedCategories = response.categories.map(x => x.id);
          },
          error: (error) => {
            console.error('Error retrieving blog post data', error);
          }
        });
       }

       this.imageSelectSubscription = this.imageService.onSelectImage().subscribe({
         next: (response) => {
          if(this.model){
            this.model.featuredImageUrl = response.url;
            this.isImageSelectorVisible = false;
          }
         },
         error: (error) => {
            console.error('Error selecting image', error);
         }
       });

      }
    });
  }

  onFormSubmit():void {
    //Convert this model to Request Object for API call
    if(this.model && this.id) {
      var updateBlogPost: UpdateBlogPost = {
        title: this.model.title,
        shortDescription: this.model.shortDescription,
        content: this.model.content,
        featuredImageUrl: this.model.featuredImageUrl,
        urlHandle: this.model.urlHandle,
        author: this.model.author,
        publishedDate: this.model.publishedDate,
        isVisible: this.model.isVisible,
        categories: this.selectedCategories?? []
      };

      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id, updateBlogPost).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        },
        error: (error) => {
          console.error('Error updating blog post', error);
        }
      });
    }

  }

  onDelete(): void {
    if(this.id) {
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        },
        error: (error) => {
          console.error('Error deleting blog post', error);
        }
      });
    }
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
